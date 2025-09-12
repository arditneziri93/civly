"use client";

import { cn } from "@/lib/utils";
import { Section } from "@/components/custom/cv-form/form-section";
import { FieldLabel } from "@/components/custom/cv-form/field-label";
import { Button } from "@/components/ui/button";
import { DatePickerInput } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { CheckIcon, TrashIcon, XIcon } from "lucide-react";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import type { CvData } from "@/schemas/cv_data_schema";
import { Fragment, useMemo, useState } from "react";
import { Separator } from "@/components/ui/separator";

export function EducationTab({ className }: { className?: string }) {
  const form = useFormContext<CvData>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "education",
  });

  // live values (not just the static `fields`)
  const values = useWatch({ control: form.control, name: "education" }) ?? [];

  const toTs = (v: unknown) => {
    // supports ISO string | Date | null | ""
    if (!v) return Number.NaN;
    const d = v instanceof Date ? v : new Date(v as string);
    const t = d.getTime();
    return Number.isNaN(t) ? Number.NaN : t;
  };

  const sorted = useMemo(() => {
    // pair each row's *original index* with live values + id for stable keys
    const rows = fields.map((f, idx) => ({
      id: f.id,
      idx, // original index for RHF ops
      v: values[idx] ?? {},
    }));

    return rows
      .map((r) => {
        const current = !!r.v?.currentlyStudyingHere;
        const endTs = current ? Number.POSITIVE_INFINITY : toTs(r.v?.endDate);
        const startTs = toTs(r.v?.startDate);
        // build a tuple for deterministic ordering:
        // 1) current first, 2) by end desc, 3) fallback start desc, 4) stable by original idx
        return {
          ...r,
          sortKey: [
            current ? 1 : 0, // current first
            Number.isNaN(endTs) ? -1 : endTs,
            Number.isNaN(startTs) ? -1 : startTs,
            -r.idx, // keep relative stability
          ] as const,
        };
      })
      .sort((a, b) => {
        // compare tuples DESC except the first flag (current)
        if (a.sortKey[0] !== b.sortKey[0]) return b.sortKey[0] - a.sortKey[0];
        if (a.sortKey[1] !== b.sortKey[1]) return b.sortKey[1] - a.sortKey[1];
        if (a.sortKey[2] !== b.sortKey[2]) return b.sortKey[2] - a.sortKey[2];
        return a.sortKey[3] - b.sortKey[3];
      });
  }, [fields, values]);

  return (
    <div className={cn("flex flex-col gap p-4", className)}>
      {sorted.map((r, i) => (
        <Fragment key={r.id}>
          <EducationRow index={r.idx} onDelete={() => remove(r.idx)} />
          {i < sorted.length - 1 && <Separator className="my-4" />}
        </Fragment>
      ))}

      <Button
        type="button"
        variant="outline"
        className="border-primary text-primary dark:border-primary-foreground dark:text-primary-foreground hover:bg-primary hover:text-primary-foreground p-8  mt-8 mb-8 cursor-pointer"
        onClick={() =>
          append({
            degree: "",
            institution: "",
            startDate: "",
            currentlyStudyingHere: false,
            endDate: "",
            location: "",
            description: "",
            isEditing: false,
          })
        }
      >
        Add Education
      </Button>
    </div>
  );
}

type EducationDisplayProps = {
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
};

function EducationRow({
  index,
  onDelete,
  className,
}: {
  index: number;
  onDelete: () => void;
  className?: string;
}) {
  const checkOrDefault = (value: string | undefined, defaultValue: string) => {
    if ([null, undefined, ""].includes(value)) {
      return defaultValue;
    }
    return value as string;
  };

  const [isDeleting, setIsDeleting] = useState(false);

  const form = useFormContext<CvData>();
  const isEditing = useWatch({
    control: form.control,
    name: `education.${index}.isEditing`,
  });

  const toggleEdit = () => {
    form.setValue(`education.${index}.isEditing`, !isEditing, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const current = form.watch(`education.${index}.currentlyStudyingHere`);
  const [displayProps, setDisplayProps] = useState<EducationDisplayProps>({
    degree: checkOrDefault(
      form.getValues(`education.${index}.degree`),
      "New Degree"
    ),
    institution: checkOrDefault(
      form.getValues(`education.${index}.institution`),
      "New Institution"
    ),
    startDate: checkOrDefault(
      form.getValues(`education.${index}.startDate`),
      ""
    ),
    endDate: checkOrDefault(form.getValues(`education.${index}.endDate`), ""),
  });

  const id = (k: string) => `edu-${index}-${k}`;

  const handleDisplayPropsChange = (
    field: string,
    value: string,
    placeholder: string
  ) => {
    const checkedValue = checkOrDefault(value, placeholder);

    setDisplayProps((prev) => ({
      ...prev,
      [field]: checkedValue,
    }));
  };

  const MonthDate = (date: string) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Section className={cn("gap-2 bg-card", className)}>
      <div className="flex  w-full justify-between ">
        <div
          className="flex w-full flex-col gap-0 cursor-pointer"
          onClick={toggleEdit}
        >
          <h3 className="text-lg font-semibold text-primary flex-1">
            {displayProps.degree}
          </h3>
          <div className="flex flex-row items-center flex-wrap">
            <p className="text-sm mr-2">{displayProps.institution}</p>
            <p className="text-sm text-muted-foreground mr-2">
              {MonthDate(displayProps.startDate)} -{" "}
              {current ? "Now" : MonthDate(displayProps.endDate)}
            </p>
          </div>
        </div>
        {isDeleting ? (
          <div className="flex flex-row gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="top-0 right-0 text-red-500 hover:bg-red-100 cursor-pointer hover:text-red-500"
              onClick={onDelete}
            >
              <CheckIcon className="h-4 w-2" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="top-0 right-0 cursor-pointer"
              onClick={() => setIsDeleting(false)}
            >
              <XIcon className="h-4 w-2" />
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="top-0 right-0 text-red-500 hover:bg-red-100 cursor-pointer hover:text-red-500"
            onClick={() => setIsDeleting(true)}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div
        className={`grid items-start  gap-x-4 gap-y-3 sm:grid-cols-[max-content_minmax(0,1fr)] ${
          !isEditing ? "hidden" : ""
        }`}
      >
        {/* Role */}
        <FieldLabel htmlFor={id("degree")}>Degree</FieldLabel>
        <FormField
          control={form.control}
          name={`education.${index}.degree`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  id={id("degree")}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleDisplayPropsChange(
                      "degree",
                      e.target.value,
                      "New Degree"
                    );
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Company */}
        <FieldLabel htmlFor={id("institution")}>Institution</FieldLabel>
        <FormField
          control={form.control}
          name={`education.${index}.institution`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  id={id("institution")}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleDisplayPropsChange(
                      "institution",
                      e.target.value,
                      "Unknown Institution"
                    );
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Start Date */}
        <FieldLabel htmlFor={id("startDate")}>Start Date</FieldLabel>
        <FormField
          control={form.control}
          name={`education.${index}.startDate`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DatePickerInput
                  value={field.value ? new Date(field.value) : null}
                  onChange={(d) => {
                    field.onChange(d);
                    handleDisplayPropsChange("startDate", d, "Start Date");
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Currently Studying Here */}
        <span></span>
        <div className="h-7 flex gap-4 place-items-center">
          <FormField
            control={form.control}
            name={`education.${index}.currentlyStudyingHere`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <input
                    id={id("currentlyStudyingHere")}
                    type="checkbox"
                    className="h-5 w-5 accent-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                    checked={!!field.value}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      field.onChange(checked);
                      if (checked) {
                        const now = new Date();
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Label className="self-center" htmlFor={id("currentlyStudyingHere")}>
            Currently Studying Here
          </Label>
        </div>

        {/* End Date (disabled when current) */}
        <FieldLabel htmlFor={id("endDate")}>End Date</FieldLabel>
        <FormField
          control={form.control}
          name={`experience.${index}.endDate`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DatePickerInput
                  disabled={current}
                  value={field.value ? new Date(field.value) : null}
                  onChange={(d) => {
                    field.onChange(d);
                    handleDisplayPropsChange("endDate", d, "End Date");
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location */}
        <FieldLabel htmlFor={id("location")}>Location</FieldLabel>
        <FormField
          control={form.control}
          name={`experience.${index}.location`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input id={id("location")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FieldLabel htmlFor={id("description")}>Description</FieldLabel>
        <FormField
          control={form.control}
          name={`experience.${index}.description`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea id={id("description")} rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Section>
  );
}
