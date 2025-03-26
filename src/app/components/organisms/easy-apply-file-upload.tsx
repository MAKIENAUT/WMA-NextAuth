"use client";
import { motion } from "motion/react";
import { Button } from "../atoms/ui/button";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { useRouter } from "next/navigation";

type UploadStatus = "idle" | "uploading" | "success" | "error";

function useEasyApplyFileUpload(token: RequestCookie | undefined) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);

  function handleTokenVerify() {
    if (!token) {
      router.push("/login");
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }

  async function handleFileUpload() {
    if (!file) return;

    setStatus("uploading");
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post("https://httpbin.org/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data ",
        },
        onUploadProgress: (ProgressEvent) => {
          const progress = ProgressEvent.total
            ? Math.round(ProgressEvent.loaded * 100) / ProgressEvent.total
            : 0;
          setUploadProgress(progress);
        },
      });

      setStatus("success");
      toast({ title: "File uploaded successfully!" });
      setUploadProgress(100);
    } catch {
      setStatus("error");
      toast({ title: "File uploaded successfully!", variant: "destructive" });
      setUploadProgress(0);
    }
  }

  return {
    file,
    status,
    handleTokenVerify,
    handleFileChange,
    uploadProgress,
    handleFileUpload,
  };
}

export default function EasyApplyFileUpload({
  token,
}: {
  token: RequestCookie | undefined;
}) {
  const {
    status,
    file,
    uploadProgress,
    handleTokenVerify,
    handleFileChange,
    handleFileUpload,
  } = useEasyApplyFileUpload(token);

  return status === "success" ? (
    <p className="font-medium">File uploaded successfully!</p>
  ) : (
    <div className="inline-flex flex-col items-center gap-2 text-center">
      <Button variant="secondary" asChild>
        <label
          htmlFor="resume"
          className={`cursor-pointer ${status === "uploading" && "pointer-events-none opacity-50"}`}
          onClick={handleTokenVerify}
        >
          {!token
            ? "Login first"
            : file
              ? "Choose another file"
              : "Send your resume"}
        </label>
      </Button>
      {token && (
        <input
          type="file"
          className="hidden"
          id="resume"
          onChange={handleFileChange}
          accept="application/pdf"
          disabled={status === "uploading"}
        />
      )}
      {file && (
        <>
          <p>File name: {file.name}</p>
          {status === "uploading" ? (
            <div className="relative h-4 w-full rounded-full bg-wma-darkTeal/50">
              <motion.div
                className="absolute left-0 top-0 z-10 h-4 rounded-full bg-wma-darkTeal"
                animate={{ width: `${uploadProgress}%` }}
              />
            </div>
          ) : (
            <Button variant="secondary" onClick={handleFileUpload}>
              Upload
            </Button>
          )}
        </>
      )}
    </div>
  );
}
