type PageProps = {
  params: Promise<{
    metier: string;
  }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { metier } = await params;

  return {
    title: `${metier} | StudioEntretien`,
  };
}

export default async function Page({ params }: PageProps) {
  const { metier } = await params;

  return (
    <div>
      <h1>{metier}</h1>
    </div>
  );
}
