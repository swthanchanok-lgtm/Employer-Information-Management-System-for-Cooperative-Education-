import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Printer } from 'lucide-react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function StudentEvaluationDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = await params;
    const studentId = Number(resolvedParams.id);

    // 1. ดึงข้อมูลนักศึกษาและการประเมินทั้งหมด
    const studentData = await prisma.user.findUnique({
        where: { id: studentId },
        include: {
            establishment: true,
            evaluations: {
                include: {
                    form: true,
                    answers: {
                        include: {
                            question: true,
                        },
                    },
                },
                orderBy: {
                    evaluatedAt: 'asc',
                },
            },
        },
    });

    if (!studentData) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
                <p className="text-red-500 font-bold text-lg">ไม่พบข้อมูลนักศึกษาในระบบจ้า</p>
            </div>
        );
    }

    // 2. ฟังก์ชันจัดรูปแบบข้อมูลให้พร้อมแสดงผลบนหน้ากระดาษ
    const formatEvaluation = (rawEval: any) => {
        if (!rawEval) return null;

        const scoreAnswers = rawEval.answers.filter((a: any) => a.score !== null);
        const totalScore = scoreAnswers.reduce((sum: number, a: any) => sum + (a.score || 0), 0);
        const remarkAnswer = rawEval.answers.find((a: any) => a.answerText && a.answerText.trim() !== '');

        return {
            title: rawEval.form?.title || 'แบบประเมินผลการปฏิบัติงาน',
            description: rawEval.form?.description || '',
            evaluatorName: rawEval.mentorName || rawEval.evaluatorName || 'ไม่ระบุชื่อ',
            score: totalScore,
            criteria: scoreAnswers.map((a: any) => ({
                name: a.question.questionText,
                score: a.score,
            })),
            remark: remarkAnswer ? remarkAnswer.answerText : '',
            evaluatedAt: new Date(rawEval.evaluatedAt).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
            // 🚩 ดึงข้อมูลลายเซ็นมาด้วย
            mentorSignature: rawEval.mentorSignatureUrl,
            teacherSignature: rawEval.teacherSignatureUrl,
            round: rawEval.round,
        };
    };

    const form1 = formatEvaluation(
        studentData.evaluations.find((e) => e.round === 'ROUND_1') || studentData.evaluations[0]
    );
    const form2 = formatEvaluation(
        studentData.evaluations.find((e) => e.round === 'ROUND_2') || studentData.evaluations[1]
    );

    const formsToDisplay = [];
    if (form1) formsToDisplay.push(form1);
    if (form2) formsToDisplay.push(form2);

    return (
        <div className="p-4 md:p-8 bg-gray-100 min-h-screen font-sans">
            {/* Header & ปุ่มย้อนกลับ */}
            <div className="max-w-4xl mx-auto mb-6 flex justify-between items-end">
                <div>
                    <Link
                        href="/teachers/instructor/students"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold text-sm mb-4 transition-colors"
                    >
                        <ArrowLeft size={16} /> กลับหน้ารวมคะแนน
                    </Link>
                    <h1 className="text-2xl font-black text-gray-800">เอกสารการประเมิน</h1>
                </div>
                <button
                    className="bg-white text-gray-700 px-4 py-2 rounded-lg border shadow-sm flex items-center gap-2 hover:bg-gray-50 transition font-bold text-sm"
                // ในอนาคตแม่สามารถใส่ฟังก์ชัน window.print() ตรงนี้ได้จ้า
                >
                    <Printer size={18} /> พิมพ์เอกสาร
                </button>
            </div>

            <div className="max-w-4xl mx-auto space-y-12">
                {formsToDisplay.length === 0 && (
                    <div className="bg-white p-12 text-center text-gray-400 rounded-lg shadow-sm border border-gray-200">
                        ยังไม่มีข้อมูลแบบประเมินในระบบ
                    </div>
                )}

                {/* เรนเดอร์ฟอร์มทีละใบ (อารมณ์เหมือนหน้า A4) */}
                {formsToDisplay.map((form, index) => (
                    <div
                        key={index}
                        className="bg-white w-full p-8 md:p-14 rounded-sm shadow-md border border-gray-200"
                    >
                        {/* หัวกระดาษ */}
                        <div className="text-center mb-8 border-b-2 border-gray-800 pb-6">
                            <h2 className="text-2xl font-black text-gray-900 mb-2">{form.title}</h2>
                            {form.description && <p className="text-gray-600">{form.description}</p>}
                            <p className="text-sm font-bold text-gray-500 mt-4">
                                รหัสเอกสาร: {form.round === 'ROUND_1' ? 'ประเมินโดยสถานประกอบการ' : 'ประเมินโดยอาจารย์นิเทศ'}
                            </p>
                        </div>

                        {/* ข้อมูลนักศึกษา */}
                        <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                            <div>
                                <span className="font-bold text-gray-600">ชื่อ-สกุล นักศึกษา:</span>{' '}
                                {studentData.prefix || ''}{studentData.name} {studentData.surname || ''}
                            </div>
                            <div>
                                <span className="font-bold text-gray-600">รหัสนักศึกษา:</span> {studentData.username}
                            </div>
                            <div>
                                <span className="font-bold text-gray-600">สาขาวิชา:</span> {studentData.department}
                            </div>
                            <div>
                                <span className="font-bold text-gray-600">สถานประกอบการ:</span>{' '}
                                {studentData.establishment?.name || '-'}
                            </div>
                        </div>

                        {/* ตารางคะแนน */}
                        <table className="w-full border-collapse border border-gray-300 mb-8 text-sm">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border border-gray-300 p-3 text-left w-16">ลำดับ</th>
                                    <th className="border border-gray-300 p-3 text-left">หัวข้อการประเมิน</th>
                                    <th className="border border-gray-300 p-3 text-center w-32">คะแนนที่ได้</th>
                                </tr>
                            </thead>
                            <tbody>
                                {form.criteria.map((item: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="border border-gray-300 p-3 text-center">{idx + 1}</td>
                                        <td className="border border-gray-300 p-3">{item.name}</td>
                                        <td className="border border-gray-300 p-3 text-center font-bold text-lg">
                                            {item.score}
                                        </td>
                                    </tr>
                                ))}
                                {/* แถวสรุปคะแนน */}
                                <tr className="bg-gray-100 font-black text-gray-900 text-base">
                                    <td colSpan={2} className="border border-gray-300 p-4 text-right">
                                        คะแนนรวมทั้งสิ้น
                                    </td>
                                    <td className="border border-gray-300 p-4 text-center text-blue-600 text-xl">
                                        {form.score}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* ข้อเสนอแนะ */}
                        <div className="mb-12 border border-gray-300 p-4 min-h-[100px]">
                            <p className="font-bold text-gray-800 mb-2 underline">ข้อเสนอแนะเพิ่มเติม / จุดเด่น / จุดที่ควรพัฒนา:</p>
                            <p className="text-gray-700 whitespace-pre-wrap">{form.remark || '-'}</p>
                        </div>

                        {/* 🚩 ส่วนลายเซ็น (ประทับตรายาง) */}
                        <div className="flex justify-end mt-16">
                            <div className="text-center w-72">
                                <p className="mb-2 text-sm">ลงชื่อผู้ประเมิน</p>

                                {/* แสดงรูปภาพลายเซ็น (ถ้ามี) */}
                                <div className="h-20 flex items-end justify-center border-b border-dashed border-gray-400 mb-2 relative">
                                    {(form.mentorSignature || form.teacherSignature) ? (
                                        <img
                                            src={form.mentorSignature || form.teacherSignature}
                                            alt="Signature"
                                            className="max-h-full max-w-full object-contain pb-1"
                                        />
                                    ) : (
                                        <span className="text-gray-300 text-xs pb-1">(ยังไม่มีลายเซ็น)</span>
                                    )}
                                </div>

                                <p className="font-bold text-sm mt-2">({form.evaluatorName})</p>
                                <p className="text-xs text-gray-500 mt-1">วันที่ประเมิน: {form.evaluatedAt}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}