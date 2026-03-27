export interface GalleryImage {
  itemImageSrc?: string
  thumbnailImageSrc?: string
  src?: string
  alt?: string
}

export type GalleryValue = string[] | GalleryImage[]
