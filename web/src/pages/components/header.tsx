import { getSession } from "next-auth/react";

import Link from "next/link";
import Image from "next/image";

import logoImg from "../../assets/logo.svg";

interface HeaderProps {
  name: string;
  image: string;
}

export default function Header(props: HeaderProps) {
  return (
    <header className="w-full h-24 bg-gray-800 ">
      <div className="max-w-[1124px] h-full flex justify-between items-center mx-auto">
        <Link href={"/"}>
          <Image src={logoImg} alt="NLW Copa" />
        </Link>

        <div className="flex items-center gap-3">
          {props.image && (
            <Image
              src={props.image}
              alt="Imagem de avatar do Google"
              width={50}
              height={50}
              quality={100}
              className="rounded-3xl"
            />
          )}

          <div className="text-gray-100">{props.name}</div>
        </div>
      </div>
    </header>
  );
}
