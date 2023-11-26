export default function TableCell({children, colSpan=1}) {
  return <td className={`bg-[#1E1E24] border border-slate-800 p-4 ${colSpan !== 1 ? 'text-center' : ''}`} colSpan={colSpan}>{children}</td>
}