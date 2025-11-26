import React from "react";

const GenreFilter: React.FC<{
  genres: string[];
  selected?: string | null;
  onChange: (g: string | null) => void;
}> = ({ genres, selected, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium">Filter:</label>
      <select
        value={selected ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="rounded border-gray-300 p-1"
      >
        <option value="">All</option>
        {genres.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GenreFilter;
