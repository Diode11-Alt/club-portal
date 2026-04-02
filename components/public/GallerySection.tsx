// components/public/GallerySection.tsx — IIMS College Campus Gallery
'use client'
import { useState } from 'react'
import { X, ZoomIn, Image as ImageIcon } from 'lucide-react'

export interface GalleryImage {
    id: string
    url?: string
    image_url?: string
    caption?: string
    created_at?: string
}

export default function GallerySection({ images }: { images: GalleryImage[] }) {
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

    return (
        <section className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16 animate-fade-up">
                    <span className="text-cosmic-brand text-xs font-bold uppercase tracking-widest mb-4 block">Campus Life</span>
                    <h2 className="text-4xl md:text-5xl font-poppins font-bold text-[#1A1A2E]">
                        Photo <span className="text-cosmic-brand">Gallery</span>
                    </h2>
                </div>

                {images.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((img, index) => (
                            <div
                                key={img.id}
                                onClick={() => setSelectedImage(img)}
                                className="group relative aspect-[4/3] overflow-hidden rounded-xl cursor-pointer border border-[#EEEEEE] bg-[var(--color-cosmic-light)] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-up"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <img
                                    src={img.url || img.image_url || ''}
                                    alt={img.caption || 'Campus Photo'}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-[#1A1A2E]/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                                    <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm mb-2">
                                        <ZoomIn className="h-5 w-5 text-white" />
                                    </div>
                                    {img.caption && (
                                        <p className="text-white text-xs font-medium leading-tight line-clamp-2">
                                            {img.caption}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border-2 border-dashed border-[#EEEEEE] p-20 text-center bg-[var(--color-cosmic-light)]">
                        <ImageIcon className="h-12 w-12 text-[#999999] mx-auto mb-4" />
                        <p className="font-poppins font-bold text-[#333333] text-xl">No photos available yet.</p>
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[60] bg-[#1A1A2E]/95 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-up"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2"
                    >
                        <X className="h-8 w-8" />
                    </button>

                    <div className="max-w-5xl w-full flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={selectedImage.url || selectedImage.image_url || ''}
                            alt={selectedImage.caption || ''}
                            className="w-full h-auto max-h-[80vh] object-contain rounded-xl shadow-2xl border border-white/10"
                        />
                        {selectedImage.caption && (
                            <div className="bg-white/10 backdrop-blur-md py-2.5 px-6 rounded-xl border border-white/10">
                                <p className="font-medium text-white text-sm">
                                    {selectedImage.caption}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    )
}
