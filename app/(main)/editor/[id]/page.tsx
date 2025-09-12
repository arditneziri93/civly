"use server";
import Editor from "./Editor";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  return (
    <Editor id={id} />
  );
}

