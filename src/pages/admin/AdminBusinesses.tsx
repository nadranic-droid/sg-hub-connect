import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Check, X, Eye, Trash2, Upload, AlertCircle, FileText } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import Papa from "papaparse";

// Recommended batch size for optimal performance
const RECOMMENDED_BATCH_SIZE = 50;
const MAX_BATCH_SIZE = 100;

interface ImportProgress {
  isImporting: boolean;
  total: number;
  processed: number;
  success: number;
  failed: number;
  errors: Array<{ row: number; error: string; data: any }>;
}

const AdminBusinesses = () => {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importProgress, setImportProgress] = useState<ImportProgress>({
    isImporting: false,
    total: 0,
    processed: 0,
    success: 0,
    failed: 0,
    errors: [],
  });
  const [selectedBusiness, setSelectedBusiness] = useState<any | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  const fetchBusinesses = async () => {
    setLoading(true);
    let query = supabase
      .from("businesses")
      .select(`
        *,
        categories (name),
        neighbourhoods (name),
        profiles:owner_id (full_name, email)
      `)
      .order("created_at", { ascending: false });

    if (searchQuery) {
      query = query.ilike("name", `%${searchQuery}%`);
    }

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data, error } = await query;

    if (error) {
      toast.error("Failed to fetch businesses");
    } else {
      setBusinesses(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBusinesses();
  }, [searchQuery, statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("businesses")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success(`Business ${status}`);
      fetchBusinesses();
      if (selectedBusiness?.id === id) {
        setReviewDialogOpen(false);
        setSelectedBusiness(null);
      }
    }
  };

  const handleReview = (business: any) => {
    setSelectedBusiness(business);
    setReviewDialogOpen(true);
  };

  const deleteBusiness = async (id: string) => {
    if (!confirm("Are you sure you want to delete this business?")) return;

    const { error } = await supabase
      .from("businesses")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete business");
    } else {
      toast.success("Business deleted");
      fetchBusinesses();
    }
  };

  // Validate CSV structure
  const validateCSV = (rows: any[]): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const requiredFields = ["name"];

    if (rows.length === 0) {
      errors.push("CSV file is empty");
      return { valid: false, errors };
    }

    // Check required fields
    const firstRow = rows[0];
    const missingFields = requiredFields.filter(
      (field) => !firstRow.hasOwnProperty(field)
    );
    if (missingFields.length > 0) {
      errors.push(`Missing required columns: ${missingFields.join(", ")}`);
    }

    // Check for empty names
    const emptyNames = rows
      .map((row, idx) => (!row.name || row.name.trim() === "" ? idx + 2 : null))
      .filter((idx) => idx !== null);
    if (emptyNames.length > 0) {
      errors.push(`Rows with missing names: ${emptyNames.join(", ")}`);
    }

    return { valid: errors.length === 0, errors };
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as any[];

        // Validate CSV
        const validation = validateCSV(rows);
        if (!validation.valid) {
          toast.error(`CSV Validation Failed: ${validation.errors.join("; ")}`);
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }

        // Warn if file is large
        if (rows.length > MAX_BATCH_SIZE) {
          const proceed = confirm(
            `You're importing ${rows.length} businesses. This will be processed in batches of ${RECOMMENDED_BATCH_SIZE}.\n\nRecommended: Split into smaller files of ${RECOMMENDED_BATCH_SIZE}-${MAX_BATCH_SIZE} businesses each for better performance.\n\nContinue anyway?`
          );
          if (!proceed) {
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
          }
        }

        // Initialize progress tracking
        setImportProgress({
          isImporting: true,
          total: rows.length,
          processed: 0,
          success: 0,
          failed: 0,
          errors: [],
        });

        try {
          // Pre-fetch all categories and neighbourhoods to reduce queries
          const [categoriesResult, neighbourhoodsResult] = await Promise.all([
            supabase.from("categories").select("id, slug, name"),
            supabase.from("neighbourhoods").select("id, slug, name"),
          ]);

          if (categoriesResult.error || neighbourhoodsResult.error) {
            throw new Error("Failed to fetch categories or neighbourhoods");
          }

          // Create lookup maps (slug -> id and name -> id)
          const categorySlugMap = new Map(
            categoriesResult.data?.map((cat) => [cat.slug, cat.id]) || []
          );
          const categoryNameMap = new Map(
            categoriesResult.data?.map((cat) => [cat.name.toLowerCase(), cat.id]) || []
          );

          const neighbourhoodSlugMap = new Map(
            neighbourhoodsResult.data?.map((hood) => [hood.slug, hood.id]) || []
          );
          const neighbourhoodNameMap = new Map(
            neighbourhoodsResult.data?.map((hood) => [hood.name.toLowerCase(), hood.id]) || []
          );

          // Process in batches
          const batchSize = RECOMMENDED_BATCH_SIZE;
          let successCount = 0;
          let failCount = 0;
          const errors: Array<{ row: number; error: string; data: any }> = [];

          for (let i = 0; i < rows.length; i += batchSize) {
            const batch = rows.slice(i, i + batchSize);
            const batchNumber = Math.floor(i / batchSize) + 1;
            const totalBatches = Math.ceil(rows.length / batchSize);

            // Prepare batch data
            const batchData = batch.map((row, batchIdx) => {
              const rowNumber = i + batchIdx + 2; // +2 because CSV row 1 is header, and we're 0-indexed
              try {
                // Try to match category by slug first, then by name
                let categoryId = null;
                if (row.category_slug) {
                   categoryId = categorySlugMap.get(row.category_slug) || 
                                categoryNameMap.get(row.category_slug.toLowerCase()) || null;
                }

                // Try to match neighbourhood by slug first, then by name
                let neighbourhoodId = null;
                if (row.neighbourhood_slug) {
                    neighbourhoodId = neighbourhoodSlugMap.get(row.neighbourhood_slug) ||
                                      neighbourhoodNameMap.get(row.neighbourhood_slug.toLowerCase()) || null;
                }

                return {
                  name: row.name?.trim(),
                  slug:
                    row.slug?.trim() ||
                    row.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                  description: row.description?.trim() || null,
                  address: row.address?.trim() || null,
                  phone: row.phone?.trim() || null,
                  website: row.website?.trim() || null,
                  price_range: row.price_range?.trim() || null,
                  category_id: categoryId,
                  neighbourhood_id: neighbourhoodId,
                  status: row.status?.trim() || "pending",
                  _rowNumber: rowNumber, // Track row number for error reporting
                };
              } catch (err: any) {
                errors.push({
                  row: rowNumber,
                  error: `Data preparation error: ${err.message}`,
                  data: row,
                });
                return null;
              }
            });

            // Filter out null entries (failed data preparation)
            const validBatchData = batchData.filter(
              (item) => item !== null
            ) as any[];

            // Batch insert
            if (validBatchData.length > 0) {
              const { error: insertError, data: insertedData } = await supabase
                .from("businesses")
                .insert(validBatchData.map(({ _rowNumber, ...data }) => data))
                .select();

              if (insertError) {
                // If batch insert fails, try individual inserts to identify problematic rows
                console.warn(
                  `Batch ${batchNumber} insert failed, trying individual inserts:`,
                  insertError
                );
                for (const item of validBatchData) {
                  const { _rowNumber, ...data } = item;
                  const { error: singleError } = await supabase
                    .from("businesses")
                    .insert(data);

                  if (singleError) {
                    failCount++;
                    errors.push({
                      row: _rowNumber,
                      error: singleError.message,
                      data: batch[_rowNumber - i - 2],
                    });
                  } else {
                    successCount++;
                  }
                }
              } else {
                successCount += insertedData?.length || validBatchData.length;
              }
            }

            // Update progress
            const processed = Math.min(i + batch.length, rows.length);
            setImportProgress({
              isImporting: true,
              total: rows.length,
              processed,
              success: successCount,
              failed: failCount,
              errors,
            });

            // Small delay between batches to avoid overwhelming the database
            if (i + batchSize < rows.length) {
              await new Promise((resolve) => setTimeout(resolve, 100));
            }
          }

          // Final update
          setImportProgress({
            isImporting: false,
            total: rows.length,
            processed: rows.length,
            success: successCount,
            failed: failCount,
            errors,
          });

          // Show results
          if (failCount === 0) {
            toast.success(
              `Successfully imported ${successCount} businesses!`
            );
          } else {
            toast.warning(
              `Import complete: ${successCount} imported, ${failCount} failed. Check the import dialog for details.`
            );
          }

          // Refresh the list
          fetchBusinesses();
        } catch (err: any) {
          toast.error(`Import failed: ${err.message}`);
          setImportProgress({
            isImporting: false,
            total: rows.length,
            processed: 0,
            success: 0,
            failed: rows.length,
            errors: [{ row: 0, error: err.message, data: {} }],
          });
        } finally {
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      },
      error: (error: Error) => {
        toast.error(`CSV Parse Error: ${error.message}`);
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
    });
  };

  const progressPercentage =
    importProgress.total > 0
      ? (importProgress.processed / importProgress.total) * 100
      : 0;

  return (
    <div className="space-y-6">
      {/* Import Progress Dialog */}
      <Dialog 
        open={importProgress.isImporting} 
        onOpenChange={(open) => {
          // Handle dialog close attempts
          if (!open) {
            const isImportActive = importProgress.isImporting && 
                                   importProgress.processed < importProgress.total;
            
            if (isImportActive) {
              // Import is still running - warn user before allowing close
              const confirmed = confirm(
                "Import is in progress. Closing this dialog won't stop the import.\n\n" +
                "Do you want to close anyway? You can check the results later."
              );
              
              if (confirmed) {
                // User confirmed - allow closing (import continues in background)
                setImportProgress(prev => ({
                  ...prev,
                  isImporting: false,
                }));
              }
              // If user cancels confirmation, don't update state
              // Dialog stays open because 'open' prop remains true
            } else {
              // Import completed or not running - allow closing freely
              setImportProgress({
                isImporting: false,
                total: 0,
                processed: 0,
                success: 0,
                failed: 0,
                errors: [],
              });
            }
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Importing Businesses</DialogTitle>
            <DialogDescription>
              Processing CSV file... Please don't close this window.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  Processed: {importProgress.processed} / {importProgress.total}
                </span>
                <span className="text-muted-foreground">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-green-600 font-medium">
                  ✓ {importProgress.success} successful
                </span>
              </div>
              <div>
                <span className="text-red-600 font-medium">
                  ✗ {importProgress.failed} failed
                </span>
              </div>
            </div>
            {importProgress.errors.length > 0 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md max-h-40 overflow-y-auto">
                <div className="text-xs font-semibold text-red-800 mb-2">
                  Errors ({importProgress.errors.length}):
                </div>
                <div className="space-y-1 text-xs text-red-700">
                  {importProgress.errors.slice(0, 10).map((err, idx) => (
                    <div key={idx}>
                      Row {err.row}: {err.error}
                    </div>
                  ))}
                  {importProgress.errors.length > 10 && (
                    <div className="text-muted-foreground">
                      ... and {importProgress.errors.length - 10} more errors
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Review Business Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Business Submission</DialogTitle>
            <DialogDescription>
              Review the business details before approving or rejecting
            </DialogDescription>
          </DialogHeader>
          {selectedBusiness && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Business Name</label>
                  <p className="text-base font-medium mt-1">{selectedBusiness.name}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge
                      variant={
                        selectedBusiness.status === "approved"
                          ? "default"
                          : selectedBusiness.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {selectedBusiness.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Category</label>
                  <p className="text-sm mt-1">{selectedBusiness.categories?.name || "Uncategorized"}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Neighbourhood</label>
                  <p className="text-sm mt-1">{selectedBusiness.neighbourhoods?.name || "Unknown"}</p>
                </div>
              </div>

              {selectedBusiness.description && (
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Description</label>
                  <p className="text-sm mt-1 whitespace-pre-wrap">{selectedBusiness.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {selectedBusiness.address && (
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">Address</label>
                    <p className="text-sm mt-1">{selectedBusiness.address}</p>
                  </div>
                )}
                {selectedBusiness.phone && (
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">Phone</label>
                    <p className="text-sm mt-1">{selectedBusiness.phone}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {selectedBusiness.website && (
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">Website</label>
                    <a
                      href={selectedBusiness.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline mt-1 block"
                    >
                      {selectedBusiness.website}
                    </a>
                  </div>
                )}
                {selectedBusiness.price_range && (
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">Price Range</label>
                    <p className="text-sm mt-1">{selectedBusiness.price_range}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-muted-foreground">Owner Information</label>
                <div className="mt-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">Name:</span> {selectedBusiness.profiles?.full_name || "Unknown"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Email:</span> {selectedBusiness.profiles?.email || "N/A"}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-muted-foreground">Slug</label>
                <p className="text-sm font-mono text-muted-foreground mt-1">{selectedBusiness.slug}</p>
              </div>

              {selectedBusiness.created_at && (
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Submitted</label>
                  <p className="text-sm mt-1">
                    {new Date(selectedBusiness.created_at).toLocaleString()}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setReviewDialogOpen(false);
                    setSelectedBusiness(null);
                  }}
                >
                  Close
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => updateStatus(selectedBusiness.id, "rejected")}
                >
                  <X className="mr-2 h-4 w-4" /> Reject
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => updateStatus(selectedBusiness.id, "approved")}
                >
                  <Check className="mr-2 h-4 w-4" /> Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Results Dialog (shown after import completes with errors) */}
      <Dialog
        open={
          !importProgress.isImporting &&
          importProgress.total > 0 &&
          importProgress.failed > 0
        }
        onOpenChange={(open) => {
          if (!open) {
            setImportProgress({
              isImporting: false,
              total: 0,
              processed: 0,
              success: 0,
              failed: 0,
              errors: [],
            });
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              Import Complete with Errors
            </DialogTitle>
            <DialogDescription>
              {importProgress.success} businesses imported successfully,{" "}
              {importProgress.failed} failed.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="text-2xl font-bold text-green-700">
                  {importProgress.success}
                </div>
                <div className="text-sm text-green-600">Successful</div>
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="text-2xl font-bold text-red-700">
                  {importProgress.failed}
                </div>
                <div className="text-sm text-red-600">Failed</div>
              </div>
            </div>
            {importProgress.errors.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-semibold">Error Details:</div>
                <div className="max-h-60 overflow-y-auto border rounded-md p-3 space-y-2">
                  {importProgress.errors.map((err, idx) => (
                    <div
                      key={idx}
                      className="text-xs p-2 bg-red-50 border border-red-200 rounded"
                    >
                      <div className="font-semibold text-red-800">
                        Row {err.row}: {err.error}
                      </div>
                      {err.data && (
                        <div className="text-red-600 mt-1">
                          Data: {JSON.stringify(err.data, null, 2)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Businesses</h2>
          <p className="text-muted-foreground">
            Manage business listings and approvals
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
            disabled={importProgress.isImporting}
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={importProgress.isImporting}
          >
            <Upload className="mr-2 h-4 w-4" /> Import CSV
          </Button>
        </div>
      </div>
      {importProgress.total === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <div className="font-semibold mb-1">CSV Import Tips:</div>
          <ul className="list-disc list-inside space-y-1 text-blue-700">
            <li>
              Recommended batch size: <strong>{RECOMMENDED_BATCH_SIZE}-{MAX_BATCH_SIZE} businesses</strong> per file
            </li>
            <li>Required columns: <strong>name</strong></li>
            <li>
              Optional columns: slug, description, address, phone, website,
              price_range, category_slug, neighbourhood_slug, status
            </li>
            <li>
              For large imports (100+), split into multiple files for better
              performance
            </li>
          </ul>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search businesses..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : businesses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No businesses found
                </TableCell>
              </TableRow>
            ) : (
              businesses.map((business) => (
                <TableRow key={business.id}>
                  <TableCell className="font-medium">
                    <div>{business.name}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {business.slug}
                    </div>
                  </TableCell>
                  <TableCell>{business.categories?.name || "Uncategorized"}</TableCell>
                  <TableCell>{business.neighbourhoods?.name || "Unknown"}</TableCell>
                  <TableCell>
                    <div className="text-sm">{business.profiles?.full_name || "Unknown"}</div>
                    <div className="text-xs text-muted-foreground">{business.profiles?.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        business.status === "approved"
                          ? "default"
                          : business.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {business.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {business.status === "pending" && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => handleReview(business)}
                          title="Review business"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="icon" variant="ghost" asChild>
                        <Link to={`/business/${business.slug}`} target="_blank" title="View on site">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      {business.status === "pending" && (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => updateStatus(business.id, "approved")}
                            title="Approve"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => updateStatus(business.id, "rejected")}
                            title="Reject"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                        onClick={() => deleteBusiness(business.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminBusinesses;

