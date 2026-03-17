import Main from './main';

const url = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
export const metadata = {
    metadataBase: url,
    title: 'SSU Dashboard - Student Academic Information',
    description:
        'Manage your Soongsil Software University academic information in one page. View grades, tuition, timetable, chapel attendance, scholarship, and graduation audit.',
    keywords: [
        'SSU',
        'Soongsil University',
        'student dashboard',
        'academic info',
        'grades',
        'tuition',
        'timetable',
        '숭실대',
        '숭실대학교',
        '학점',
        '학생 정보',
        '등록금',
        '등록금 내역',
        '졸업사정표',
        '학비',
        '성적',
    ],
    openGraph: {
        title: 'SSU Dashboard - Student Academic Information',
        description: 'Manage your Soongsil Software University academic information in one page.',
        type: 'website',
        images: [
            {
                url: 'https://raw.githubusercontent.com/dt313/ssu-dashboard/refs/heads/main/public/images/og-image.png?token=GHSAT0AAAAAADE666TN24NKVYWVEZEMDCTI2NZFN6A',
                width: 1200,
                height: 630,
                alt: 'SSU Dashboard',
            },
        ],
    },
};

function Page() {
    return <Main />;
}

export default Page;
