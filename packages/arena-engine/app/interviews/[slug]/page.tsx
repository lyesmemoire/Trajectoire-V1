
type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function InterviewPage({ params }: PageProps) {
  const { slug } = await params;
  return <div className="p-8">Interview Page - {slug}</div>;
}
