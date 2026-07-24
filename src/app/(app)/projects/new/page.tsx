import type { Metadata } from "next";

import { PageHeader } from "@/components/app-shell/page-header";

import { NewProjectForm } from "./new-project-form";

export const metadata: Metadata = {
  title: "Nouveau projet",
};

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Nouveau projet" />
      <NewProjectForm />
    </div>
  );
}
