"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { format } from "date-fns-jalali";
import { faIR } from "date-fns/locale";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trash2,
  Eye,
  Filter,
  ImageOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { showError, showSuccess } from "@/lib/toast";

export type AdminJobAdStatus = "PUBLISHED" | "PENDING" | "REJECTED";

export interface AdminJobAd {
  id: string;
  title: string;
  createdAt: string;
  status: AdminJobAdStatus;
  phone?: string | null;
  moderationNote?: string | null;
  isDeleted?: boolean | null;
  categorySlug?: string | null;
  city?: string | null;
}

interface AdminJobAdFull extends AdminJobAd {
  description?: string | null;
  images?: string[]; // ⬅️ دقیقا طبق schema
  user?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    role: string;
    createdAt: string;
  } | null;
}

export const REJECTION_REASONS = [
  { code: "INCOMPLETE_INFO", label: "اطلاعات آگهی ناقص است" },
  { code: "WRONG_CATEGORY", label: "آگهی در دسته‌بندی اشتباه ثبت شده است" },
  { code: "INVALID_CONTACT", label: "اطلاعات تماس نامعتبر یا ناقص است" },
  { code: "DUPLICATE_AD", label: "این آگهی تکراری است" },
  { code: "SPAM", label: "آگهی مشکوک به اسپم است" },
  { code: "INAPPROPRIATE_CONTENT", label: "محتوای آگهی نامناسب است" },
  { code: "PROHIBITED_SERVICE", label: "خدمت/کالای ارائه‌شده مجاز نیست" },
  { code: "MISLEADING_INFO", label: "اطلاعات آگهی گمراه‌کننده است" },
  { code: "PRICE_PROBLEM", label: "مشکل در قیمت‌گذاری (غیرواقعی / نامشخص)" },
  { code: "IMAGE_PROBLEM", label: "مشکل در تصاویر (نامرتبط / بی‌کیفیت / نامناسب)" },
  { code: "VIOLATES_RULES", label: "آگهی با قوانین سایت مغایرت دارد" },
  { code: "COPYRIGHT_ISSUE", label: "مشکل کپی‌رایت یا حقوق مالکیت معنوی" },
  { code: "CONTACT_OUT_OF_SERVICE", label: "شماره تماس پاسخگو نیست یا از دسترس خارج است" },
  { code: "TEMPORARY_CLOSED", label: "فعالیت کسب‌وکار به‌صورت موقت متوقف شده است" },
  { code: "OTHER", label: "سایر موارد (توضیح در یادداشت)" },
];

type FilterStatus = "ALL" | "PENDING" | "PUBLISHED" | "REJECTED" | "DELETED";

export default function AdminAdsPage() {
  const [ads, setAds] = useState<AdminJobAd[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  const [rejectReason, setRejectReason] = useState<string>("INCOMPLETE_INFO");
  const [rejectAdId, setRejectAdId] = useState<string | null>(null);

  const [filterStatus, setFilterStatus] = useState<FilterStatus>("PENDING");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewAd, setViewAd] = useState<AdminJobAdFull | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  const fetchAds = async (options?: { status?: FilterStatus; category?: string }) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      const st = options?.status ?? filterStatus;
      const cat = options?.category ?? filterCategory;

      if (st && st !== "ALL") params.set("status", st);
      if (cat && cat !== "ALL") params.set("category", cat);

      const res = await fetch(`/api/admin/ads?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        let msg = "خطا در دریافت لیست آگهی‌ها";
        try {
          const data = await res.json();
          msg = data?.error || msg;
        } catch {
          // ignore
        }
        throw new Error(msg);
      }

      const data = await res.json();
      const list: AdminJobAd[] = Array.isArray(data)
        ? data
        : Array.isArray(data.ads)
        ? data.ads
        : [];

      setAds(list);
    } catch (error: unknown) {
      console.error("❌ fetchAds error:", error);
      const msg =
        error instanceof Error
          ? error.message
          : "خطا در دریافت لیست آگهی‌ها";
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pendingCount = useMemo(
    () => ads.filter((ad) => ad.status === "PENDING" && !ad.isDeleted).length,
    [ads]
  );

  const categoriesFromData = useMemo(() => {
    const set = new Set<string>();
    ads.forEach((ad) => {
      if (ad.categorySlug) set.add(ad.categorySlug);
    });
    return Array.from(set);
  }, [ads]);

  const filteredAds = useMemo(() => {
    let list = [...ads];

    if (filterStatus === "PENDING") {
      list = list.filter((ad) => ad.status === "PENDING" && !ad.isDeleted);
    } else if (filterStatus === "PUBLISHED") {
      list = list.filter((ad) => ad.status === "PUBLISHED" && !ad.isDeleted);
    } else if (filterStatus === "REJECTED") {
      list = list.filter((ad) => ad.status === "REJECTED" && !ad.isDeleted);
    } else if (filterStatus === "DELETED") {
      list = list.filter((ad) => ad.isDeleted);
    }

    if (filterCategory !== "ALL") {
      list = list.filter((ad) => ad.categorySlug === filterCategory);
    }

    list.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return list;
  }, [ads, filterStatus, filterCategory]);

  const formatDate = (value: string) => {
    try {
      return format(new Date(value), "yyyy/MM/dd HH:mm", { locale: faIR });
    } catch {
      return value;
    }
  };

  const renderStatusBadge = (ad: AdminJobAd) => {
    if (ad.isDeleted) {
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1 text-xs text-gray-600"
        >
          <Trash2 className="w-3 h-3 text-gray-500" />
          حذف شده
        </Badge>
      );
    }

    if (ad.status === "PUBLISHED") {
      return (
        <Badge className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-xs">
          <CheckCircle2 className="w-3 h-3" />
          منتشر شده
        </Badge>
      );
    }

    if (ad.status === "REJECTED") {
      return (
        <Badge className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-xs">
          <XCircle className="w-3 h-3" />
          رد شده
        </Badge>
      );
    }

    return (
      <Badge className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-xs">
        <AlertCircle className="w-3 h-3" />
        در صف بررسی
      </Badge>
    );
  };

  const handleModerate = async (
    id: string,
    action: "APPROVE" | "REJECT" | "DELETE",
    note?: string
  ) => {
    try {
      setProcessingId(id);

      const res = await fetch(`/api/admin/ads/${id}/moderate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, note }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "خطا در انجام عملیات مدیر");
      }

      showSuccess(data?.message || "عملیات با موفقیت انجام شد");
      await fetchAds();
    } catch (error: unknown) {
      console.error("❌ handleModerate error:", error);
      const msg =
        error instanceof Error
          ? error.message
          : "خطا در انجام عملیات مدیر";
      showError(msg);
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectModal = (adId: string) => {
    setRejectAdId(adId);
    setRejectReason("INCOMPLETE_INFO");
    setRejectNote("");
    setRejectModalOpen(true);
  };

  const submitReject = async () => {
    if (!rejectAdId) return;

    const reasonLabel =
      REJECTION_REASONS.find((r) => r.code === rejectReason)?.label ?? "";
    const finalNote = `${reasonLabel}${
      rejectNote ? " - " + rejectNote : ""
    }`;

    await handleModerate(rejectAdId, "REJECT", finalNote);
    setRejectModalOpen(false);
  };

  const handleDeleteAd = async (id: string) => {
    const confirmed = window.confirm(
      "آیا از حذف این آگهی اطمینان دارید؟"
    );
    if (!confirmed) return;

    await handleModerate(id, "DELETE", "حذف توسط مدیر سیستم");
  };

  const openViewModal = async (id: string) => {
    try {
      setViewLoading(true);
      setViewModalOpen(true);

      const res = await fetch(`/api/admin/ads/${id}`, {
        method: "GET",
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "خطا در دریافت آگهی");
      }

      setViewAd(data);
    } catch (error: unknown) {
      console.error("❌ openViewModal error:", error);
      const msg =
        error instanceof Error ? error.message : "خطا در دریافت آگهی";
      showError(msg);
      setViewModalOpen(false);
    } finally {
      setViewLoading(false);
    }
  };

  // ⬅️ حذف تصویر بر اساس index در آرایه images
  const handleDeleteImage = async (adId: string, imageIndex: number) => {
    const confirmed = window.confirm(
      "آیا از حذف این تصویر اطمینان دارید؟"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(
        `/api/admin/ads/${adId}/images/${imageIndex}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "خطا در حذف تصویر");
      }

      showSuccess(data?.message || "تصویر با موفقیت حذف شد");

      if (viewAd && viewAd.id === adId) {
        const imgs = viewAd.images ?? [];
        const newImages = imgs.filter((_, idx) => idx !== imageIndex);
        setViewAd({ ...viewAd, images: newImages });
      }

      await fetchAds();
    } catch (error: unknown) {
      console.error("❌ handleDeleteImage error:", error);
      const msg =
        error instanceof Error ? error.message : "خطا در حذف تصویر";
      showError(msg);
    }
  };

  // تصاویر نرمال‌سازی‌شده برای نمایش
  const normalizedViewImages = useMemo(() => {
    if (!viewAd || !viewAd.images) return [];

    return (viewAd.images as string[])
      .filter((url) => typeof url === "string" && url.trim().length > 0);
  }, [viewAd]);

  return (
    <div className="space-y-4">
      {/* هدر + نوتیفیکیشن + فیلترها */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-bold">مدیریت آگهی‌ها</h1>
          <p className="text-sm text-gray-500">
            بررسی، تأیید، رد و حذف آگهی‌ها توسط سوپر ادمین
          </p>
          {pendingCount > 0 && (
            <div className="mt-1 inline-flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-1 text-xs text-amber-700 border border-amber-200">
              <AlertCircle className="w-3 h-3" />
              <span>
                {pendingCount} آگهی در صف بررسی است. (قدیمی‌ترین آگهی‌ها در
                بالا نمایش داده شده‌اند.)
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500">فیلترها</span>
          </div>

          {/* فیلتر وضعیت */}
          <Select
            value={filterStatus}
            onValueChange={(value) => {
              setFilterStatus(value as FilterStatus);
            }}
          >
            <SelectTrigger className="w-36 h-9 text-xs">
              <SelectValue placeholder="وضعیت" />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="ALL">همه وضعیت‌ها</SelectItem>
              <SelectItem value="PENDING">در صف بررسی</SelectItem>
              <SelectItem value="PUBLISHED">منتشر شده</SelectItem>
              <SelectItem value="REJECTED">رد شده</SelectItem>
              <SelectItem value="DELETED">حذف شده</SelectItem>
            </SelectContent>
          </Select>

          {/* فیلتر دسته‌بندی */}
          <Select
            value={filterCategory}
            onValueChange={(value: string) => setFilterCategory(value)}
          >
            <SelectTrigger className="w-40 h-9 text-xs">
              <SelectValue placeholder="دسته‌بندی" />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="ALL">همه دسته‌ها</SelectItem>
              {categoriesFromData.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={() => fetchAds()}
          >
            بروزرسانی لیست
          </Button>
        </div>
      </div>

      {/* جدول آگهی‌ها */}
      <div className="rounded-2xl border bg-white/80 backdrop-blur p-3 md:p-4 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead className="text-right">تاریخ ثبت</TableHead>
                <TableHead className="text-right">عنوان</TableHead>
                <TableHead className="text-right hidden md:table-cell">
                  دسته
                </TableHead>
                <TableHead className="text-right hidden md:table-cell">
                  شهر
                </TableHead>
                <TableHead className="text-right">وضعیت</TableHead>
                <TableHead className="text-right hidden md:table-cell">
                  موبایل کاربر
                </TableHead>
                <TableHead className="text-left">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAds.length === 0 && !loading && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-6 text-center text-sm text-gray-500"
                  >
                    آگهی‌ای برای نمایش وجود ندارد.
                  </TableCell>
                </TableRow>
              )}

              {filteredAds.map((ad) => (
                <TableRow key={ad.id} className="text-xs">
                  <TableCell>{formatDate(ad.createdAt)}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {ad.title}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {ad.categorySlug || "-"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {ad.city || "-"}
                  </TableCell>
                  <TableCell>{renderStatusBadge(ad)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {ad.phone || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 justify-end">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() => openViewModal(ad.id)}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>

                      <Button
                        size="icon"
                        className="h-7 w-7 bg-emerald-600 hover:bg-emerald-700"
                        disabled={
                          processingId === ad.id ||
                          ad.status === "PUBLISHED" ||
                          !!ad.isDeleted
                        }
                        onClick={() => {
                          if (ad.status === "PUBLISHED") {
                            showError("این آگهی قبلاً منتشر شده است.");
                            return;
                          }
                          if (ad.isDeleted) {
                            showError("آگهی حذف شده است.");
                            return;
                          }
                          handleModerate(ad.id, "APPROVE");
                        }}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                      </Button>

                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7 border-red-200 text-red-600 hover:bg-red-50"
                        disabled={processingId === ad.id || !!ad.isDeleted}
                        onClick={() => openRejectModal(ad.id)}
                      >
                        <XCircle className="w-3 h-3" />
                      </Button>

                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7 border-red-500 text-red-600 hover:bg-red-50"
                        disabled={processingId === ad.id || !!ad.isDeleted}
                        onClick={() => handleDeleteAd(ad.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {loading && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-5 text-center text-sm text-gray-500"
                  >
                    در حال بارگذاری آگهی‌ها...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* مودال رد آگهی */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="glass-modal-content max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold">
              رد آگهی و ثبت علت
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <span className="font-medium">علت اصلی رد آگهی</span>
              <Select
                value={rejectReason}
                onValueChange={(value: string) => setRejectReason(value)}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="انتخاب علت" />
                </SelectTrigger>
                <SelectContent className="text-xs max-h-60">
                  {REJECTION_REASONS.map((r) => (
                    <SelectItem key={r.code} value={r.code}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <span className="font-medium">
                توضیحات تکمیلی برای ثبت در پرونده آگهی (اختیاری)
              </span>
              <Textarea
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                rows={4}
                className="text-xs"
                placeholder="اگر جزئیات بیشتری لازم است، اینجا بنویسید..."
              />
            </div>
          </div>

          <DialogFooter className="mt-3 flex flex-row gap-2 justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRejectModalOpen(false)}
            >
              انصراف
            </Button>
            <Button
              type="button"
              size="sm"
              className="bg-red-600 hover:bg-red-700"
              disabled={!rejectAdId}
              onClick={submitReject}
            >
              ثبت رد آگهی
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* مودال مشاهده کامل آگهی */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="glass-modal-content max-w-3xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold">
              جزئیات آگهی
            </DialogTitle>
          </DialogHeader>

          {viewLoading && (
            <div className="py-6 text-center text-sm text-gray-500">
              در حال بارگذاری آگهی...
            </div>
          )}

          {!viewLoading && viewAd && (
            <div className="space-y-4 text-xs">
              <div className="flex flex-col gap-2 md:flex-row md:justify-between">
                <div className="space-y-1">
                  <div className="font-semibold text-sm">{viewAd.title}</div>
                  <div className="text-gray-500">
                    {viewAd.city || "-"} | {viewAd.categorySlug || "-"}
                  </div>
                  <div className="text-gray-400 text-[11px]">
                    ثبت شده در {formatDate(viewAd.createdAt)}
                  </div>
                  <div>{renderStatusBadge(viewAd)}</div>
                </div>

                {viewAd.user && (
                  <div className="space-y-1 text-right md:text-left">
                    <div className="font-medium">اطلاعات کاربر</div>
                    <div>
                      نام:{" "}
                      {viewAd.user.firstName || viewAd.user.lastName
                        ? `${viewAd.user.firstName || ""} ${
                            viewAd.user.lastName || ""
                          }`
                        : "-"}
                    </div>
                    <div>نقش: {viewAd.user.role}</div>
                    <div>موبایل: {viewAd.user.phone || "-"}</div>
                  </div>
                )}
              </div>

              {viewAd.description && (
                <div className="space-y-1">
                  <div className="font-medium">توضیحات آگهی</div>
                  <div className="whitespace-pre-wrap text-gray-700">
                    {viewAd.description}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="font-medium flex items-center gap-2">
                  تصاویر آگهی
                </div>

                {normalizedViewImages.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {normalizedViewImages.map((url, index) => (
                      <div
                        key={`${index}-${url}`}
                        className="relative w-32 h-32 rounded-xl overflow-hidden border bg-gray-50"
                      >
                        <Image
                          src={url}
                          alt=""
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1 left-1 flex flex-col gap-1">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6 bg-white/80 backdrop-blur"
                            onClick={() =>
                              handleDeleteImage(viewAd.id, index)
                            }
                          >
                            <Trash2 className="w-3 h-3 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <ImageOff className="w-4 h-4" />
                    تصویری برای این آگهی ثبت نشده است.
                  </div>
                )}
              </div>

              {viewAd.moderationNote && (
                <div className="space-y-1">
                  <div className="font-medium">یادداشت مدیر</div>
                  <div className="text-gray-600 whitespace-pre-wrap">
                    {viewAd.moderationNote}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
