// Componente presentacional: solo recibe props y pinta.
interface Props {
  label: string;
  ok: boolean | null;
  detail: string;
}

export function StatusCard({ label, ok, detail }: Props) {
  const tone = ok === null ? 'pending' : ok ? 'ok' : 'fail';
  return (
    <div className={`status-card ${tone}`}>
      <span className="dot" aria-hidden />
      <div>
        <p className="label">{label}</p>
        <p className="detail">{detail}</p>
      </div>
    </div>
  );
}
