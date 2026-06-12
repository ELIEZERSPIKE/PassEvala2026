import { getImageUrl } from "../../../utils/imageUtils";
import { BonPlan } from "./BonPlanForm";

interface BonPlanTableProps {
  bonPlans: BonPlan[];
  onEdit: (bonPlan: BonPlan) => void;
  onDelete: (id: number) => void;
}

export default function BonPlanTable({ bonPlans, onEdit, onDelete }: BonPlanTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full border-collapse text-left text-sm text-gray-500">
        <thead className="bg-gray-50 text-xs uppercase text-gray-400 font-medium">
          <tr>
            <th className="px-6 py-4">Bon Plan</th>
            <th className="px-6 py-4">Catégorie</th>
            <th className="px-6 py-4">Description</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 border-t border-gray-200">
          {bonPlans.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                Aucun bon plan trouvé.
              </td>
            </tr>
          ) : (
            bonPlans.map((bonPlan) => (
              <tr key={bonPlan.id} className="hover:bg-gray-50">
                {/* Colonne Image + Titre */}
                <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                  {bonPlan.image_path && (
                    <img 
                      src={getImageUrl(bonPlan.image_path)} 
                      alt="" 
                      className="h-10 w-10 rounded object-cover border" 
                    />
                  )}
                  <span className="truncate max-w-[200px]">{bonPlan.title}</span>
                </td>

                {/* Colonne Catégorie */}
                <td className="px-6 py-4">
                  {bonPlan.category ? (
                    <span className="inline-flex items-center rounded-md bg-teal-50 px-2 py-1 text-xs font-medium text-teal-700 ring-1 ring-inset ring-teal-600/20">
                      {bonPlan.category}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>

                {/* Colonne Description */}
                <td className="px-6 py-4 max-w-xs truncate">
                  {bonPlan.description || <span className="text-gray-400">Aucune description</span>}
                </td>

                {/* Actions (Éditer / Supprimer) */}
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <button 
                    onClick={() => onEdit(bonPlan)} 
                    className="text-teal-600 hover:text-teal-800 font-medium mr-3 transition-colors"
                  >
                    Éditer
                  </button>
                  <button 
                    onClick={() => onDelete(bonPlan.id)} 
                    className="text-red-600 hover:text-red-800 font-medium transition-colors"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}