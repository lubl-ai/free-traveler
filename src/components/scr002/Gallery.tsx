import { representative } from '@/data/representative';

/**
 * Travel Gallery
 * REQ-FUNC-061
 *
 * At least 8 photos, each with a real-place alt description and a source
 * attribution. Desktop 4 columns / Mobile 2 columns.
 */

export function Gallery() {
  return (
    <div className="grid grid-cols-2 gap-sm md:grid-cols-4 md:gap-md">
      {representative.gallery.map((image, idx) => (
        <figure key={idx} className="overflow-hidden rounded-md bg-surface-strong">
          <div className="aspect-square w-full" aria-hidden={!image.url}>
            {image.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image.url} alt={image.alt} className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <span className="sr-only">{image.alt}</span>
            )}
          </div>
          <figcaption className="p-xs text-caption text-muted">{image.source}</figcaption>
        </figure>
      ))}
    </div>
  );
}
