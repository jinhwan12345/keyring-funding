'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { Heart, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface FundingData {
    title: string;
    target_amount: number;
    current_amount: number;
    total_supporters: number;
}

interface Comment {
    id: number;
    content: string;
}

export default function Home() {
    const [funding, setFunding] = useState<FundingData | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [selectedReward, setSelectedReward] = useState<string | null>(null);

    useEffect(() => {
        // 펀딩 정보 및 댓글 가져오기
        async function fetchData() {
            const { data: fundingData } = await supabase.from('funding_status').select('*').single();
            const { data: commentData } = await supabase.from('comments').select('*').order('id', { ascending: false });

            if (fundingData) setFunding(fundingData);
            if (commentData) setComments(commentData);
        }
        fetchData();
    }, []);

    // 후원하기 기능 (클릭 시 카운트 증가 예시)
    const handleSupport = async () => {
        if (!funding) return;

        const updatedSupporters = funding.total_supporters + 1;
        const updatedAmount = funding.current_amount + 15000; // 키링 단가 예시

        const { error } = await supabase
            .from('funding_status')
            .update({ total_supporters: updatedSupporters, current_amount: updatedAmount })
            .eq('title', funding.title);

        if (!error) {
            setFunding({
                ...funding,
                total_supporters: updatedSupporters,
                current_amount: updatedAmount,
            });
            alert('아직 안됨 ㅎ');
        }
    };

    if (!funding) return <div className="text-white text-center py-20">로딩 중...</div>;

    const achievementRate = Math.round((funding.current_amount / funding.target_amount) * 100);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <section className="bg-[#111827] text-white pt-12 pb-16 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* 태그 및 날짜 */}
                    <div className="flex gap-2 mb-4 text-xs font-bold">
                        <span className="bg-red-600 px-3 py-1 rounded-full">잠실 참정권 운동</span>
                        <span className="bg-gray-700 px-3 py-1 rounded-full text-blue-400">2025.06.03</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        {/* 타이틀 및 설명 */}
                        <div className="space-y-4">
                            <div className="h-6 bg-gray-700 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-700 rounded w-1/2"></div>

                            {/* CTA 버튼 */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={handleSupport}
                                    className="bg-[#C83727] hover:bg-red-700 text-white font-bold py-3 px-6 rounded text-sm transition-all"
                                >
                                    지금 후원하기
                                </button>
                                <button className="border border-gray-600 hover:bg-gray-800 text-white py-3 px-6 rounded text-sm">
                                    더 알아보기
                                </button>
                            </div>
                        </div>

                        {/* 메인 이미지 */}
                        <div className="w-full">
                            <div className="bg-gray-800/30 rounded-xl border border-gray-700/70 p-2 overflow-hidden relative w-full aspect-[2584/1605] shadow-2xl">
                                <Image
                                    src="/keyring_main.png"
                                    alt="잠실의 참정권 운동을 기억하는 법 - 일상속의 올공 내 삶과 잠실민주화"
                                    fill
                                    priority
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-contain rounded-lg"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 대시보드 스탯 지표 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 bg-[#1F2937] p-6 rounded-lg border border-gray-800">
                        <div className="text-center border-r border-gray-700 last:border-0">
                            <p className="text-gray-400 text-xs">마감까지</p>
                            <p className="text-xl font-bold mt-1 text-[#C83727]">D-7</p>
                        </div>
                        <div className="text-center md:border-r border-gray-700">
                            <p className="text-gray-400 text-xs">달성률</p>
                            <p className="text-xl font-bold mt-1">{achievementRate}%</p>
                        </div>
                        <div className="text-center border-r border-gray-700">
                            <p className="text-gray-400 text-xs">후원자</p>
                            <p className="text-xl font-bold mt-1">{funding.total_supporters}명</p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-400 text-xs">서명일</p>
                            <p className="text-xl font-bold mt-1 text-red-400">6/3</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 운동 소개 (소개글 섹션) --- */}
            <section className="py-12 px-4 max-w-4xl mx-auto">
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded">운동 소개</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="space-y-3">
                        <p className="text-gray-600 leading-relaxed text-sm">
                            어디서나 함께, 잠실의 기억을 일상으로 가져옵니다. 본 프로젝트는 잠실의 역사적 가치와
                            상징성을 담아 상생의 가치를 실현하고자 시작되었습니다.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <p className="text-gray-600 leading-relaxed text-sm">
                            수많은 분들의 열화와 같은 성원에 힘입어, 제작 펀딩을 통해 완성도 높은 굿즈 및 키링 형태로
                            소장하실 수 있도록 기획 단계를 거쳐 오픈되었습니다.
                        </p>
                    </div>
                </div>
            </section>

            <hr className="max-w-4xl mx-auto border-gray-200" />

            {/* --- 리워드 키링 소개 --- */}
            <section className="py-12 px-4 max-w-4xl mx-auto">
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded">
                    리워드 - 참정권에 대한 두 가지 태도
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* 리워드 1: 블랙 에디션 */}
                    <div
                        className={`border rounded-lg p-5 bg-white transition-all ${selectedReward === 'black' ? 'ring-2 ring-black' : ''}`}
                    >
                        {/* 이미지 컨테이너: 원본 비율을 유지하며 깔끔하게 노출 */}
                        <div className="h-90 rounded flex items-center justify-center mb-4 overflow-hidden p-2">
                            <Image
                                src="/black_keyring.png"
                                alt="민주주의 훼손과 애도의 국화"
                                width={400} // 화면에 보여줄 적절한 가로 크기
                                height={408} // 741:756 비율에 맞춘 세로 크기
                                className="object-contain hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <h4 className="font-bold text-base">민주주의 훼손과 애도의 국화</h4>
                        <p className="text-xs text-gray-500 mt-1">블랙 / 흑백 에디션</p>
                        <div className="flex justify-between items-center mt-6 pt-4 border-t">
                            <span className="font-bold text-sm">키링</span>
                            <button
                                onClick={() => setSelectedReward('black')}
                                className={`text-xs font-bold py-2 px-4 rounded border ${selectedReward === 'black' ? 'bg-black text-white' : 'border-gray-300 hover:bg-gray-50'}`}
                            >
                                {selectedReward === 'black' ? '선택됨' : '선택'}
                            </button>
                        </div>
                    </div>

                    {/* 리워드 2: 컬러 에디션 */}
                    <div
                        className={`border rounded-lg p-5 bg-white relative transition-all ${selectedReward === 'color' ? 'ring-2 ring-[#C83727]' : ''}`}
                    >
                        {/* 이미지 컨테이너 */}
                        <div className="h-90 rounded flex items-center justify-center mb-4 overflow-hidden p-2">
                            <Image
                                src="/color_keyring.png"
                                alt="대한민국 재건 태극과 무궁화"
                                width={400} // 화면에 보여줄 적절한 가로 크기
                                height={408} // 741:756 비율에 맞춘 세로 크기
                                className="object-containtransition-transform duration-300"
                            />
                        </div>
                        <h4 className="font-bold text-base">대한민국 재건 태극과 무궁화</h4>
                        <p className="text-xs text-gray-500 mt-1">레드-블루 / 컬러 에디션</p>
                        <div className="flex justify-between items-center mt-6 pt-4 border-t">
                            <span className="font-bold text-sm">키링</span>
                            <button
                                onClick={() => setSelectedReward('color')}
                                className={`text-xs font-bold py-2 px-4 rounded ${selectedReward === 'color' ? 'bg-[#C83727] text-white' : 'bg-[#C83727] hover:bg-red-700 text-white'}`}
                            >
                                {selectedReward === 'color' ? '선택됨' : '선택'}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 소셜 증거 (후원 요청 댓글 한줄평 리스트) --- */}
            <section className="bg-[#111827] text-white py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <p className="text-xs text-gray-400 font-medium mb-6">많은 분들의 요청으로 오픈된 크라우드펀딩</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {comments.slice(0, 6).map((comment) => (
                            <div
                                key={comment.id}
                                className="bg-gray-800/60 border border-gray-700 p-4 rounded text-xs text-gray-300 leading-relaxed"
                            >
                                "{comment.content}"
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- 후원자 안내 섹션 --- */}
            <section className="py-12 px-4 max-w-4xl mx-auto">
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded">후원자 안내</span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                    <div>
                        <h5 className="font-bold text-sm text-gray-800 border-l-2 border-blue-600 pl-2 mb-2">
                            온라인 후원
                        </h5>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            선택하신 리워드는 펀딩 마감 후 순차적으로 각 등록된 주소지로 일괄 택배 발송 처리됩니다.
                        </p>
                    </div>
                    <div>
                        <h5 className="font-bold text-sm text-red-600 border-l-2 border-red-600 pl-2 mb-2">
                            오프라인 무료 배포
                        </h5>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            잠실 부스 현장 방문 시 선착순으로 일부 수량 한정 무료 배포 혜택 이벤트가 진행됩니다.
                        </p>
                    </div>
                </div>

                <div className="mt-6 bg-blue-50 border border-blue-200 p-3 rounded text-xs text-blue-800 flex items-center gap-2">
                    <span className="font-bold">[안내]</span> 펀딩 금액은 배송비, 제작비, 오프라인 캠페인 유지 비용으로
                    투명하게 사용됩니다.
                </div>
            </section>

            {/* --- 하단 고정형 느낌의 미니 하단 CTA 및 푸터 --- */}
            <footer className="bg-black text-white py-8 px-4 text-center border-t border-gray-900">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-left">
                        <h3 className="font-bold text-base">잠실의 기억을 일상 속으로</h3>
                        <p className="text-xs text-gray-500 mt-1">일상속의 물결 — 내 삶과 잠실민주화</p>
                    </div>
                    <button
                        onClick={handleSupport}
                        className="w-full md:w-auto bg-[#C83727] hover:bg-red-700 font-bold py-3 px-8 rounded text-sm flex items-center justify-center gap-2 transition-all"
                    >
                        지금 후원하기 <ChevronRight size={16} />
                    </button>
                </div>
                <p className="text-[10px] text-gray-600 mt-8">
                    © 2026 잠실민주화 - 크라우드펀딩 프로젝트 · 문의: 올공 현장 부스
                </p>
            </footer>
        </div>
    );
}
