import { getImageUrl } from "../../../utils/imageUtils";
import { Sponsor } from "./SponsorForm";
import SponsorStatusBadge from "./SponsorStatusBadge";

interface SponsorTableProps {
  sponsors: Sponsor[];
  onEdit: (sponsor: Sponsor) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
}

export default function SponsorTable({ sponsors, onEdit, onDelete, onToggleStatus }: SponsorTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full border-collapse text-left text-sm text-gray-500">
        <thead className="bg-gray-50 text-xs uppercase text-gray-400 font-medium">
          <tr>
            <th className="px-6 py-4">Sponsor</th>
            <th className="px-6 py-4">Localisation</th>
            <th className="px-6 py-4">Contact</th>
            <th className="px-6 py-4">Statut</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 border-t border-gray-200">
          {sponsors.map((sponsor) => (
            <tr key={sponsor.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                {sponsor.banner_url && (
                  <img src={getImageUrl(sponsor.banner_url)} alt="" className="h-8 w-12 rounded object-cover border" />
                )}
                {sponsor.name}
              </td>
              <td className="px-6 py-4">{sponsor.company_location || "-"}</td>
              <td className="px-6 py-4">
                <div className="text-xs">{sponsor.email}</div>
                <div className="text-xs text-gray-400">{sponsor.phone}</div>
              </td>
              <td className="px-6 py-4">
                <SponsorStatusBadge isActive={sponsor.is_active} onToggle={() => onToggleStatus(sponsor.id)} />
              </td>
              <td className="px-6 py-4 text-right">
                <button onClick={() => onEdit(sponsor)} className="text-teal-600 hover:text-teal-800 font-medium mr-3">Éditer</button>
                <button onClick={() => onDelete(sponsor.id)} className="text-red-600 hover:text-red-800 font-medium">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}