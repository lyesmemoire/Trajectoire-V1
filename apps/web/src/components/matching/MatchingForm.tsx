"use client";

import {
  ChangeEvent,
  DragEvent,
  FormEvent,
  useRef,
  useState,
} from "react";
import {
  CheckCircle2,
  FileText,
  Loader2,
  Trash2,
  UploadCloud,
} from "lucide-react";

interface MatchingResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
}

interface MatchingFormProps {
  onMatch: (
    results: MatchingResult,
  ) => void;
}

interface UploadResponse {
  success?: boolean;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  textLength?: number;
  extractedText?: string;
  error?: string;
  hint?: string;
}

interface ApiError {
  error?: string;
}

const MAX_FILE_SIZE =
  8 * 1024 * 1024;

const ACCEPTED_EXTENSIONS = [
  ".pdf",
  ".docx",
];

function formatFileSize(
  bytes: number,
): string {
  if (bytes < 1024) {
    return `${bytes} octets`;
  }

  if (
    bytes <
    1024 * 1024
  ) {
    return `${(
      bytes / 1024
    ).toFixed(0)} Ko`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} Mo`;
}

function isAllowedFile(
  file: File,
): boolean {
  const name =
    file.name.toLowerCase();

  return ACCEPTED_EXTENSIONS.some(
    (extension) =>
      name.endsWith(
        extension,
      ),
  );
}

export function MatchingForm({
  onMatch,
}: MatchingFormProps) {
  const fileInputRef =
    useRef<HTMLInputElement | null>(
      null,
    );

  const [cvText, setCvText] =
    useState("");

  const [
    uploadedFileName,
    setUploadedFileName,
  ] = useState("");

  const [
    uploadedFileSize,
    setUploadedFileSize,
  ] = useState(0);

  const [
    jobDescription,
    setJobDescription,
  ] = useState("");

  const [
    uploading,
    setUploading,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [dragging, setDragging] =
    useState(false);

  const [error, setError] =
    useState<string | null>(
      null,
    );

  const resetFile = () => {
    setCvText("");
    setUploadedFileName("");
    setUploadedFileSize(0);

    if (
      fileInputRef.current
    ) {
      fileInputRef.current.value =
        "";
    }
  };

  const processFile = async (
    file: File,
  ) => {
    setError(null);

    if (!isAllowedFile(file)) {
      resetFile();

      setError(
        "Format non supporté. Utilisez un fichier PDF ou DOCX.",
      );

      return;
    }

    if (file.size === 0) {
      resetFile();

      setError(
        "Le fichier sélectionné est vide.",
      );

      return;
    }

    if (
      file.size >
      MAX_FILE_SIZE
    ) {
      resetFile();

      setError(
        "Le fichier dépasse la limite de 8 Mo.",
      );

      return;
    }

    setUploading(true);

    try {
      const formData =
        new FormData();

      formData.append(
        "file",
        file,
      );

      const response =
        await fetch(
          "/api/cv/upload",
          {
            method: "POST",
            body: formData,
          },
        );

      const body =
        (await response
          .json()
          .catch(
            () =>
              ({}),
          )) as UploadResponse;

      if (
        !response.ok ||
        !body.extractedText
      ) {
        throw new Error(
          body.error ||
            "Impossible de lire ce CV.",
        );
      }

      setCvText(
        body.extractedText,
      );

      setUploadedFileName(
        body.fileName ||
          file.name,
      );

      setUploadedFileSize(
        body.fileSize ??
          file.size,
      );
    } catch (caughtError) {
      resetFile();

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Une erreur est survenue lors de la lecture du CV.",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (
    event:
      ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (file) {
      void processFile(file);
    }
  };

  const handleDragOver = (
    event:
      DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setDragging(true);
  };

  const handleDragLeave = (
    event:
      DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setDragging(false);
  };

  const handleDrop = (
    event:
      DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setDragging(false);

    const file =
      event.dataTransfer
        .files?.[0];

    if (file) {
      void processFile(file);
    }
  };

  const handleSubmit = async (
    event:
      FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (
      loading ||
      uploading
    ) {
      return;
    }

    if (!cvText.trim()) {
      setError(
        "Téléchargez votre CV avant de lancer le matching.",
      );

      return;
    }

    if (
      !jobDescription.trim()
    ) {
      setError(
        "Ajoutez la description du poste.",
      );

      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response =
        await fetch(
          "/api/matching/calculate-score",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body:
              JSON.stringify({
                cvText,
                jobDescription:
                  jobDescription.trim(),
              }),
          },
        );

      const body =
        await response
          .json()
          .catch(
            () =>
              ({}),
          );

      if (!response.ok) {
        throw new Error(
          (
            body as ApiError
          ).error ||
            "Impossible de calculer le matching.",
        );
      }

      onMatch(
        body as MatchingResult,
      );
    } catch (caughtError) {
      console.error(
        "[Matching] Calculation failed:",
        caughtError,
      );

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Une erreur est survenue pendant le matching.",
      );
    } finally {
      setLoading(false);
    }
  };

  const hasCv =
    cvText.trim().length > 0;

  return (
    <div className="rounded-2xl border border-ivoire-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-ink-900">
          Nouveau Matching
        </h2>

        <p className="mt-1 text-sm text-ink-500">
          Téléchargez votre CV puis
          ajoutez la description du
          poste à comparer.
        </p>
      </div>

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-6"
      >
        <div>
          <label className="mb-2 block text-sm font-medium text-ink-700">
            CV du candidat
          </label>

          {!hasCv ? (
            <div
              role="button"
              tabIndex={0}
              onClick={() =>
                fileInputRef
                  .current
                  ?.click()
              }
              onKeyDown={(
                event,
              ) => {
                if (
                  event.key ===
                    "Enter" ||
                  event.key === " "
                ) {
                  event.preventDefault();

                  fileInputRef
                    .current
                    ?.click();
                }
              }}
              onDragOver={
                handleDragOver
              }
              onDragLeave={
                handleDragLeave
              }
              onDrop={
                handleDrop
              }
              className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition ${
                dragging
                  ? "border-bronze-500 bg-bronze-50"
                  : "border-ivoire-300 bg-ivoire-50 hover:border-bronze-400 hover:bg-bronze-50/50"
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className="mx-auto h-10 w-10 animate-spin text-bronze-600" />

                  <p className="mt-4 font-medium text-ink-900">
                    Lecture du CV...
                  </p>

                  <p className="mt-1 text-sm text-ink-500">
                    Extraction du texte
                    en cours
                  </p>
                </>
              ) : (
                <>
                  <UploadCloud className="mx-auto h-10 w-10 text-bronze-600" />

                  <p className="mt-4 font-medium text-ink-900">
                    Déposez votre CV
                    ici
                  </p>

                  <p className="mt-1 text-sm text-ink-500">
                    ou cliquez pour
                    sélectionner un
                    fichier
                  </p>

                  <p className="mt-3 text-xs text-ink-400">
                    PDF ou DOCX · 8 Mo
                    maximum
                  </p>
                </>
              )}

              <input
                ref={
                  fileInputRef
                }
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="sr-only"
                disabled={
                  uploading
                }
                onChange={
                  handleFileChange
                }
              />
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 p-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
                  <FileText className="h-5 w-5 text-green-700" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium text-ink-900">
                      {
                        uploadedFileName
                      }
                    </p>

                    <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                  </div>

                  <p className="text-sm text-green-700">
                    {formatFileSize(
                      uploadedFileSize,
                    )}{" "}
                    · Document prêt
                    pour le matching
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  resetFile();
                  setError(null);
                }}
                className="ml-3 rounded-lg p-2 text-ink-500 transition hover:bg-white hover:text-red-600"
                aria-label="Supprimer le CV"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="matching-job"
            className="mb-2 block text-sm font-medium text-ink-700"
          >
            Description du poste
          </label>

          <textarea
            id="matching-job"
            value={
              jobDescription
            }
            onChange={(
              event,
            ) =>
              setJobDescription(
                event.target
                  .value,
              )
            }
            rows={8}
            maxLength={
              50_000
            }
            className="w-full resize-y rounded-xl border border-ivoire-300 bg-white p-4 text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-bronze-500 focus:ring-2 focus:ring-bronze-500/20"
            placeholder="Collez ici la description du poste, les responsabilités et les compétences recherchées..."
            required
          />

          <div className="mt-1 text-right text-xs text-ink-400">
            {jobDescription.length.toLocaleString(
              "fr-FR",
            )}{" "}
            / 50 000
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={
            loading ||
            uploading ||
            !hasCv ||
            !jobDescription.trim()
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-bronze-600 px-5 py-3 font-medium text-white transition hover:bg-bronze-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyse en cours...
            </>
          ) : (
            "Analyser la compatibilité"
          )}
        </button>
      </form>
    </div>
  );
}