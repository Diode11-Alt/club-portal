// components/public/AboutSection.tsx — IIMS College Modern About
import Link from 'next/link'
import { BookOpen, Award, Users, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function AboutSection({ aboutText }: { aboutText?: string | null }) {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Content */}
                <div className="space-y-8 animate-fade-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cosmic-brand/8 text-cosmic-brand font-poppins text-xs font-bold tracking-wider uppercase">
                        <BookOpen className="h-4 w-4" />
                        <span>About IIMS College</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-poppins font-bold text-[#1A1A2E] leading-tight">
                        Academic <span className="text-cosmic-brand">Excellence</span> Meets Innovation
                    </h2>

                    <div className="space-y-5 text-[#444444] text-lg leading-relaxed">
                        {aboutText ? (
                            <p>{aboutText}</p>
                        ) : (
                            <>
                                <p>
                                    IIMS College is one of Nepal's leading educational institutions, offering a diverse range of undergraduate and graduate programs designed to produce industry-ready professionals.
                                </p>
                                <p>
                                    With a commitment to academic rigor, practical learning, and holistic development, we empower our students to become tomorrow's leaders, innovators, and change-makers.
                                </p>
                            </>
                        )}
                    </div>

                    {/* Key Points */}
                    <div className="space-y-3 pt-2">
                        <KeyPoint text="Accredited programs with global recognition" />
                        <KeyPoint text="Industry-experienced faculty and mentors" />
                        <KeyPoint text="State-of-the-art campus and research labs" />
                        <KeyPoint text="Strong alumni network across 50+ companies" />
                    </div>

                    <div className="pt-4">
                        <Link
                            href="/about"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1A1A2E] text-white font-bold text-sm hover:bg-[#16162a] transition-all shadow-lg hover:shadow-xl"
                        >
                            Learn More
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>

                {/* Visual Area */}
                <div className="relative animate-fade-up">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-[#124E66]/5 to-[#F4C542]/5 blur-3xl rounded-3xl" />
                    <div className="relative grid grid-cols-2 gap-4">
                        {/* Image Cards */}
                        <div className="space-y-4">
                            <div className="rounded-2xl overflow-hidden shadow-lg border border-[#EEEEEE] aspect-[4/5] bg-[var(--color-cosmic-light)]">
                                <img
                                    src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&q=80"
                                    alt="Students collaborating"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            <div className="rounded-2xl bg-cosmic-brand p-6 text-white shadow-lg">
                                <Award className="h-8 w-8 mb-3 text-[#F4C542]" />
                                <p className="font-poppins font-bold text-2xl">A+</p>
                                <p className="text-white/70 text-sm font-medium">Graded Institution</p>
                            </div>
                        </div>
                        <div className="space-y-4 pt-8">
                            <div className="rounded-2xl bg-[#1A1A2E] p-6 text-white shadow-lg">
                                <Users className="h-8 w-8 mb-3 text-[#F4C542]" />
                                <p className="font-poppins font-bold text-2xl">5000+</p>
                                <p className="text-white/60 text-sm font-medium">Successful Alumni</p>
                            </div>
                            <div className="rounded-2xl overflow-hidden shadow-lg border border-[#EEEEEE] aspect-[4/5] bg-[var(--color-cosmic-light)]">
                                <img
                                    src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80"
                                    alt="Campus life"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function KeyPoint({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-cosmic-brand flex-shrink-0" />
            <span className="text-[#444444] font-medium">{text}</span>
        </div>
    )
}
