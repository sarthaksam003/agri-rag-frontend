import React, { useEffect, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  HiOutlineDocumentText,
  HiOutlineTrash,
  HiOutlineArrowUpTray,
  HiOutlineCloudArrowUp,
  HiOutlineExclamationTriangle,
  HiOutlineCheckCircle,
  HiOutlineArrowPath,
} from 'react-icons/hi2';
import useChatStore from '../../store/chatStore';
import {
  ingestDocuments,
  listDocuments,
  deleteDocument,
  deleteAllDocuments,
  getJobStatus,
} from '../../services/api';

const DocumentsPanel = () => {
  const { documents, setDocuments, documentsLoading, setDocumentsLoading, tenantId } =
    useChatStore();
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [tenantId]);

  // Poll jobs
  useEffect(() => {
    if (jobs.length === 0) return;
    const interval = setInterval(async () => {
      const updatedJobs = await Promise.all(
        jobs.map(async (j) => {
          if (j.status === 'completed' || j.status === 'failed') return j;
          try {
            const data = await getJobStatus(j.job_id);
            return { ...j, ...data };
          } catch {
            return j;
          }
        })
      );
      setJobs(updatedJobs);
      const allDone = updatedJobs.every(
        (j) => j.status === 'completed' || j.status === 'failed'
      );
      if (allDone) {
        fetchDocuments();
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [jobs]);

  const fetchDocuments = async () => {
    setDocumentsLoading(true);
    try {
      const data = await listDocuments(tenantId);
      setDocuments(data.data?.documents || []);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
      setDocuments([]);
    } finally {
      setDocumentsLoading(false);
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;

      setUploading(true);
      setUploadResult(null);

      try {
        const data = await ingestDocuments(acceptedFiles, tenantId);
        setUploadResult(data);

        // Track jobs
        const newJobs = (data.processed_files || [])
          .filter((f) => f.job_id)
          .map((f) => ({
            job_id: f.job_id,
            filename: f.filename,
            status: f.status,
          }));
        setJobs((prev) => [...prev, ...newJobs]);

        // If no jobs (sync processing), refresh docs
        if (newJobs.length === 0) {
          fetchDocuments();
        }
      } catch (err) {
        setUploadResult({
          error: err.response?.data?.error || 'Upload failed',
        });
      } finally {
        setUploading(false);
      }
    },
    [tenantId]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    disabled: uploading,
  });

  const handleDeleteDoc = async (docId) => {
    try {
      await deleteDocument(docId, tenantId);
      fetchDocuments();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllDocuments(tenantId);
      setConfirmDeleteAll(false);
      fetchDocuments();
    } catch (err) {
      console.error('Delete all failed:', err);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <HiOutlineDocumentText className="w-5 h-5 text-odia-primary" />
            ଡକ୍ୟୁମେଣ୍ଟ ପରିଚାଳନା
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Document Management — Upload, view, and manage your knowledge base
          </p>
        </div>

        {/* Upload Zone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all
            ${
              isDragActive
                ? 'border-odia-primary bg-odia-bg scale-[1.02]'
                : 'border-border hover:border-odia-primary/50 hover:bg-surface-darker'
            }
            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            {uploading ? (
              <div className="w-10 h-10 border-3 border-odia-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <HiOutlineCloudArrowUp
                className={`w-10 h-10 ${isDragActive ? 'text-odia-primary' : 'text-text-muted'}`}
              />
            )}
            <div>
              <p className="text-sm font-medium text-text-primary">
                {isDragActive
                  ? 'Drop PDF files here'
                  : uploading
                  ? 'Uploading...'
                  : 'Drag & drop PDF files here'}
              </p>
              <p className="text-xs text-text-muted mt-1">
                or click to browse • PDF files only
              </p>
            </div>
          </div>
        </div>

        {/* Upload Result */}
        {uploadResult && (
          <div
            className={`rounded-xl p-4 text-sm animate-fade-in ${
              uploadResult.error
                ? 'bg-error/10 border border-error/20 text-error'
                : 'bg-success/10 border border-success/20 text-success'
            }`}
          >
            {uploadResult.error ? (
              <div className="flex items-center gap-2">
                <HiOutlineExclamationTriangle className="w-5 h-5" />
                <span>{uploadResult.error}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <HiOutlineCheckCircle className="w-5 h-5" />
                <span>
                  {uploadResult.total_processed} file(s) processed, {uploadResult.total_failed}{' '}
                  failed
                </span>
              </div>
            )}
          </div>
        )}

        {/* Active Jobs */}
        {jobs.filter((j) => j.status !== 'completed' && j.status !== 'failed').length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-text-secondary">Processing...</h3>
            {jobs
              .filter((j) => j.status !== 'completed' && j.status !== 'failed')
              .map((j) => (
                <div
                  key={j.job_id}
                  className="flex items-center gap-3 bg-odia-bg rounded-xl px-4 py-3"
                >
                  <div className="w-5 h-5 border-2 border-odia-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-odia-dark truncate">{j.filename}</span>
                  <span className="text-xs text-text-muted ml-auto">{j.status}</span>
                </div>
              ))}
          </div>
        )}

        {/* Documents List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-text-primary">
              Ingested Documents ({documents.length})
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchDocuments}
                className="p-2 rounded-lg hover:bg-surface-darker text-text-muted hover:text-text-secondary transition-colors"
                title="Refresh"
              >
                <HiOutlineArrowPath
                  className={`w-4 h-4 ${documentsLoading ? 'animate-spin' : ''}`}
                />
              </button>
              {documents.length > 0 && (
                <>
                  {confirmDeleteAll ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-error">Are you sure?</span>
                      <button
                        onClick={handleDeleteAll}
                        className="px-2 py-1 text-xs bg-error text-white rounded-lg hover:bg-error/90"
                      >
                        Yes, delete all
                      </button>
                      <button
                        onClick={() => setConfirmDeleteAll(false)}
                        className="px-2 py-1 text-xs bg-surface-darker text-text-secondary rounded-lg hover:bg-surface-dark"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteAll(true)}
                      className="flex items-center gap-1 px-2 py-1.5 text-xs rounded-lg text-error hover:bg-error/10 transition-colors"
                    >
                      <HiOutlineTrash className="w-3.5 h-3.5" />
                      Delete All
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {documentsLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-3 border-odia-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12 bg-surface-darker rounded-2xl">
              <HiOutlineDocumentText className="w-12 h-12 text-text-muted mx-auto mb-3" />
              <p className="text-sm text-text-secondary">No documents ingested yet</p>
              <p className="text-xs text-text-muted mt-1">
                Upload PDFs to build your knowledge base
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.document_id || doc.id}
                  className="flex items-center gap-3 bg-white border border-border rounded-xl px-4 py-3 hover:shadow-sm transition-shadow"
                >
                  <div className="w-9 h-9 rounded-lg bg-odia-bg flex items-center justify-center flex-shrink-0">
                    <HiOutlineDocumentText className="w-5 h-5 text-odia-dark" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {doc.filename || doc.document_id || doc.id}
                    </p>
                    {doc.chunk_count && (
                      <p className="text-xs text-text-muted">{doc.chunk_count} chunks</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteDoc(doc.document_id || doc.id)}
                    className="p-2 rounded-lg hover:bg-error/10 text-text-muted hover:text-error transition-colors flex-shrink-0"
                    title="Delete document"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentsPanel;
