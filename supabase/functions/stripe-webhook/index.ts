import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  apiVersion: "2025-08-27.basil",
  httpClient: Stripe.createFetchHttpClient(),
});

const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response(
      JSON.stringify({ error: "No signature" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response(
      JSON.stringify({ error: "Invalid signature" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    // Handle checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata || {};

      // Check if this is a featured listing upgrade
      if (metadata.plan_type === "featured_listing" && metadata.business_id) {
        const businessId = metadata.business_id;
        const duration = metadata.duration || "month";
        const userId = metadata.user_id;

        // Calculate expiration date based on duration
        const expiresAt = new Date();
        switch (duration) {
          case "month":
            expiresAt.setMonth(expiresAt.getMonth() + 1);
            break;
          case "quarter":
            expiresAt.setMonth(expiresAt.getMonth() + 3);
            break;
          case "year":
            expiresAt.setFullYear(expiresAt.getFullYear() + 1);
            break;
          default:
            expiresAt.setMonth(expiresAt.getMonth() + 1);
        }

        // Get payment amount
        const paymentIntentId = session.payment_intent as string;
        let amountPaid = 0;
        if (paymentIntentId) {
          const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
          amountPaid = (paymentIntent.amount || 0) / 100; // Convert from cents
        }

        // Update business to featured
        const { error: updateError } = await supabaseClient
          .from("businesses")
          .update({
            is_featured: true,
            featured_expires_at: expiresAt.toISOString(),
          })
          .eq("id", businessId);

        if (updateError) {
          console.error("Error updating business:", updateError);
          throw updateError;
        }

        // Record the purchase
        const { error: purchaseError } = await supabaseClient
          .from("featured_listing_purchases")
          .insert({
            business_id: businessId,
            user_id: userId,
            stripe_checkout_session_id: session.id,
            stripe_payment_intent_id: paymentIntentId,
            plan_type: duration,
            amount_paid: amountPaid,
            currency: session.currency?.toUpperCase() || "SGD",
            expires_at: expiresAt.toISOString(),
            is_active: true,
          });

        if (purchaseError) {
          console.error("Error recording purchase:", purchaseError);
          // Don't throw - business is already updated
        }

        console.log(`Featured listing activated for business ${businessId}, expires ${expiresAt.toISOString()}`);
      }
    }

    // Handle payment_intent.succeeded for additional verification
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      // Additional verification logic if needed
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

