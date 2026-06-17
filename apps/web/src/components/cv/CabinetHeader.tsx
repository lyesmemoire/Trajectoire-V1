export default function CabinetHeader({ meta }: any) {
  return (
    <div className="cabinet-header">
      <div className="cabinet-meta">
        <span>TRAJECTOIRE — CABINET DOSSIER</span>
        <span>Engine: {meta?.engine_version}</span>
        <span>Model: {meta?.model}</span>
        <span>{meta?.timestamp ? new Date(meta.timestamp).toLocaleString() : ''}</span>
      </div>
    </div>
  )
}
