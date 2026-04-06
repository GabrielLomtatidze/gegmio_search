import { Skeleton } from "@/components/ui/skeleton";

export default function CardSkeleton() {

    return (
        <>
            <div className="w-[252px] h-[260px] border border-[#2b2b2b] rounded-xl overflow-hidden relative">

                <div className="absolute top-[10px] right-[10px] z-20">
                    <Skeleton className="w-[32px] h-[32px] rounded-full bg-black/20" />
                </div>

                <div className="w-full h-[180px] relative">
                    <Skeleton className="w-full h-full bg-[#181818]" />

                    <div className="absolute top-[10px] left-[10px]">
                        <Skeleton className="w-[90px] h-[28px] rounded-2xl bg-[#181818]" />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                <div className="p-[10px] space-y-2">

                    <div className="flex justify-between items-center">
                        <Skeleton className="w-[80px] h-[14px] bg-[#181818]" />
                        <Skeleton className="w-[60px] h-[14px] bg-[#181818]" />
                    </div>

                    <Skeleton className="w-[140px] h-[16px] bg-[#181818]" />

                    <Skeleton className="w-full h-[12px] bg-[#181818]" />
                </div>
            </div>
        </>

    );
}