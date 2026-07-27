type Props = {
  title: string;
  descriptionText: string;
  isExpanded: boolean;
  isLongDesc: boolean;
  onToggleExpand: () => void;
};

export default function DescriptionCard({
  title,
  descriptionText,
  isExpanded,
  isLongDesc,
  onToggleExpand,
}: Props) {
  return (
    <div
      className={`bg-card border border-card rounded-3xl p-6 flex flex-col relative overflow-hidden transition-all duration-500 shadow-custom ${
        isExpanded ? 'lg:col-span-3 min-h-[300px] ring-1 ring-border-card' : ''
      }`}
    >
      <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-4">
        About {title}
      </h3>

      <div
        className={`text-foreground text-sm leading-relaxed whitespace-pre-wrap flex-1 ${
          !isExpanded && isLongDesc ? 'line-clamp-6' : ''
        }`}
      >
        {descriptionText}
      </div>

      {isLongDesc && (
        <button
          onClick={onToggleExpand}
          className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 bg-area hover:bg-hover text-foreground text-xs font-bold rounded-xl transition-colors self-start border border-card"
        >
          {isExpanded ? '− See Less' : '+ See More'}
        </button>
      )}
    </div>
  );
}
