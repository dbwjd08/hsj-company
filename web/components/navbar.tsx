import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { userState, logOut } from '@/lib/auth';

const Navbar = ({ className }: { className: string }) => {
  const router = useRouter();

  const user = useRecoilValue(userState);

  const handleLogout = async () => {
    try {
      await logOut();
      router.push('/login');
    } catch (error: any) {
      console.log(error.message);
    }
  };
  const menuItems = user.uid
    ? [
      {
        id: 1,
        name: '대시보드',
        link: '/dashboard',
      },
      {
        id: 2,
        name: '마이페이지',
        link: '/mypage',
      },
      {
        id: 3,
        name: '로그아웃',
        onClick: handleLogout,
      },
    ]
    : [
      {
        id: 1,
        name: '로그인',
        link: '/login',
      },
      {
        id: 2,
        name: '회원가입',
        link: '/signup',
      },
      {
        id: 3,
        name: '고객센터',
        link: '/',
      },
    ];

  return (
    <>
      <header
        className={`${className} max-w-full min-w-[1200px] bg-white shadow-md shadow-gray-100 sticky top-0 z-10`}
      >
        <div className="flex flex-wrap items-center justify-between max-w-7xl mx-auto px-4">
          <div className="flex items-center text-blue-900 hover:text-blue-800 cursor-pointer transition duration-150 ">
            <Link href="/">
              <div className="font-system_bold flex text-[1.6rem] text-primary items-center">
                <span className="font-semibold text-lg font-sans w-12 m-6">
                  <Image
                    src="/yuppie_logo.png"
                    alt="yuppie_logo"
                    width={62}
                    height={33}
                  ></Image>
                </span>
                여러분의 PB, 여P
              </div>
            </Link>
          </div>

          <nav
            className={`md:flex md:items-center font-title w-full md:w-auto`}
          >
            <ul className="font-system_medium text-lg inline-block">
              {menuItems.map((item) => (
                <li
                  key={item.id}
                  className="my-3 md:my-0 items-center mr-8 md:inline-block block "
                >
                  <Link href={item?.link || ''}>
                    <a href="" onClick={item?.onClick} className="text-primary">
                      {item?.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Navbar;
