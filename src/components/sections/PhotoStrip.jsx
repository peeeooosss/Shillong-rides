import { PHOTOS } from "../../data/photos";

export default function PhotoStrip() {
  return (
    <section className="section-photos" aria-hidden="true">
      <div className="container">
        <div className="photo-band">
          {PHOTOS.gallery.map((src) => (
            <img key={src} src={src} alt="" loading="lazy" decoding="async" width="960" height="640" />
          ))}
        </div>
      </div>
    </section>
  );
}
