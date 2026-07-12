import { useState } from "react";

import {
  HardDrive,
  Save,
} from "lucide-react";

import type {
  CreateEvidenceImagePayload,
  EvidenceImageFormat,
  EvidenceImagingStatus,
} from "../../types/evidenceImaging";

interface Props {
  onSubmit: (
    payload: CreateEvidenceImagePayload
  ) => Promise<void>;
}

const imageFormats: EvidenceImageFormat[] = [
  "RAW",
  "DD",
  "E01",
  "AFF4",
  "OTHER",
];

const statuses: EvidenceImagingStatus[] = [
  "PLANNED",
  "IN_PROGRESS",
  "COMPLETED",
  "VERIFIED",
  "FAILED",
];

export default function EvidenceImagingForm({
  onSubmit,
}: Props) {
  const [sourceDevice, setSourceDevice] =
    useState("");
  const [sourceType, setSourceType] =
    useState("");
  const [imageFormat, setImageFormat] =
    useState<EvidenceImageFormat>("E01");
  const [imagePath, setImagePath] =
    useState("");
  const [imageSizeBytes, setImageSizeBytes] =
    useState("");
  const [acquisitionTool, setAcquisitionTool] =
    useState("");
  const [writeBlockerUsed, setWriteBlockerUsed] =
    useState(true);
  const [hashMd5, setHashMd5] =
    useState("");
  const [hashSha1, setHashSha1] =
    useState("");
  const [hashSha256, setHashSha256] =
    useState("");
  const [verificationStatus, setVerificationStatus] =
    useState<EvidenceImagingStatus>("PLANNED");
  const [acquiredAt, setAcquiredAt] =
    useState("");
  const [notes, setNotes] =
    useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const resetForm = () => {
    setSourceDevice("");
    setSourceType("");
    setImageFormat("E01");
    setImagePath("");
    setImageSizeBytes("");
    setAcquisitionTool("");
    setWriteBlockerUsed(true);
    setHashMd5("");
    setHashSha1("");
    setHashSha256("");
    setVerificationStatus("PLANNED");
    setAcquiredAt("");
    setNotes("");
  };

  const handleSubmit = async () => {
    if (!sourceDevice.trim() || !sourceType.trim()) {
      alert("Source device and source type are required.");
      return;
    }

    const parsedSize =
      imageSizeBytes.trim().length > 0
        ? Number(imageSizeBytes)
        : undefined;

    if (
      parsedSize !== undefined &&
      Number.isNaN(parsedSize)
    ) {
      alert("Image size must be a valid number.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        sourceDevice: sourceDevice.trim(),
        sourceType: sourceType.trim(),
        imageFormat,
        imagePath: imagePath.trim() || undefined,
        imageSizeBytes: parsedSize,
        acquisitionTool:
          acquisitionTool.trim() || undefined,
        writeBlockerUsed,
        hashMd5: hashMd5.trim() || undefined,
        hashSha1: hashSha1.trim() || undefined,
        hashSha256: hashSha256.trim() || undefined,
        verificationStatus,
        acquiredAt: acquiredAt || undefined,
        notes: notes.trim() || undefined,
      });

      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-lg shadow-black/20">
      <div className="mb-5 flex items-center gap-3">
        <HardDrive
          size={22}
          className="text-cyan-300"
        />

        <div>
          <h2 className="text-lg font-bold text-zinc-100">
            Add Evidence Imaging Record
          </h2>

          <p className="text-xs text-zinc-500">
            Register forensic acquisition metadata, image format,
            hashing, write blocker usage, and verification status.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InputField
          label="Source Device"
          value={sourceDevice}
          onChange={setSourceDevice}
          placeholder="HOST-01 Disk 0"
          required
        />

        <InputField
          label="Source Type"
          value={sourceType}
          onChange={setSourceType}
          placeholder="NVMe SSD / USB / Memory Card"
          required
        />

        <SelectField
          label="Image Format"
          value={imageFormat}
          onChange={(value) =>
            setImageFormat(
              value as EvidenceImageFormat
            )
          }
          options={imageFormats}
        />

        <SelectField
          label="Verification Status"
          value={verificationStatus}
          onChange={(value) =>
            setVerificationStatus(
              value as EvidenceImagingStatus
            )
          }
          options={statuses}
        />

        <InputField
          label="Image Path"
          value={imagePath}
          onChange={setImagePath}
          placeholder="D:\Cases\BlackBasta\HOST-01.E01"
        />

        <InputField
          label="Image Size Bytes"
          value={imageSizeBytes}
          onChange={setImageSizeBytes}
          placeholder="347892350976"
          type="number"
        />

        <InputField
          label="Acquisition Tool"
          value={acquisitionTool}
          onChange={setAcquisitionTool}
          placeholder="FTK Imager / Guymager"
        />

        <InputField
          label="Acquired At"
          value={acquiredAt}
          onChange={setAcquiredAt}
          type="datetime-local"
        />

        <InputField
          label="MD5"
          value={hashMd5}
          onChange={setHashMd5}
          placeholder="Optional"
        />

        <InputField
          label="SHA1"
          value={hashSha1}
          onChange={setHashSha1}
          placeholder="Optional"
        />

        <InputField
          label="SHA256"
          value={hashSha256}
          onChange={setHashSha256}
          placeholder="Required for verification"
        />

        <label className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={writeBlockerUsed}
            onChange={(event) =>
              setWriteBlockerUsed(
                event.target.checked
              )
            }
            className="h-4 w-4 accent-cyan-500"
          />

          Write blocker used
        </label>

        <div className="md:col-span-2 xl:col-span-4">
          <label className="text-xs font-medium text-zinc-500">
            Notes
          </label>

          <textarea
            value={notes}
            onChange={(event) =>
              setNotes(event.target.value)
            }
            placeholder="Acquisition notes, source condition, operator note, or chain-of-custody context..."
            rows={3}
            className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-cyan-500/50"
          />
        </div>
      </div>

      <button
        type="button"
        disabled={isSubmitting}
        onClick={handleSubmit}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-zinc-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Save size={17} />
        {isSubmitting
          ? "Saving..."
          : "Save Imaging Record"}
      </button>
    </section>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label>
      <span className="text-xs font-medium text-zinc-500">
        {label}
        {required && (
          <span className="text-red-400"> *</span>
        )}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-cyan-500/50"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label>
      <span className="text-xs font-medium text-zinc-500">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-cyan-500/50"
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}