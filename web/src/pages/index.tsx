import Image from "next/image";
import appPreviewImage from "../assets/app-nlw-copa-preview.png";
import logoImg from "../assets/logo.svg";
import usersAvatarExampleImg from "../assets/users-avatar-example.png";
import iconCheckImg from "../assets/icon-check.svg";

import { api } from "../lib/axios";

import { FormEvent, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPooltitle] = useState("");

  const { data: session } = useSession();
  const router = useRouter();

  async function createPool(event: FormEvent) {
    event.preventDefault();

    try {
      if (!session) {
        const response = await api.post("/pools", {
          title: poolTitle,
        });

        const { code } = response.data;

        await navigator.clipboard.writeText(code);

        toast.success(
          "Bolão criado com sucesso,o código foi copiado para a área de transferência!"
        );
      } else {
        const user = await api.post("/users", { access_token: session?.token });

        const { token } = user.data;

        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const response = await api.post("/pools", {
          title: poolTitle,
        });

        const { code } = response.data;

        await navigator.clipboard.writeText(code);

        alert(
          `Bolão criado com sucesso,o código foi copiado para a área de transferência!`
        );

        router.push({
          pathname: "/boloes",
          query: { routerToken: token },
        });
      }

      setPooltitle("");
    } catch (err) {
      console.log(err);
      toast.error("Falha ao criar o bolão, tente novamente");
    }
  }

  return (
    <div className="h-screen w-screen bg-app bg-no-repeat bg-cover">
      <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center ">
        <main>
          <Image src={logoImg} alt="NLW Copa" />

          <h1 className="mt-14 text-5xl font-bold leading-tight text-white">
            Crie seu próprio bolão da copa e compartilhe entre amigos!
          </h1>

          <div className="mt-10 flex items-center gap-2">
            <Image src={usersAvatarExampleImg} alt="" />
            <strong className="text-gray-100 text-xl ">
              <span className="text-ignite-500">+{props.userCount}</span>{" "}
              pessoas já estão usando
            </strong>
          </div>

          <form onSubmit={createPool} className="mt-10 flex gap-2">
            <input
              className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
              type="text"
              required
              placeholder="Qual nome do seu bolão?"
              onChange={(event) => setPooltitle(event.target.value)}
              value={poolTitle}
            />
            <button
              className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
              type="submit"
            >
              Criar meu bolão
            </button>
          </form>

          {!session ? (
            <p
              className="mt-2 text-sm text-white cursor-pointer hover:underline"
              onClick={() => signIn()}
            >
              Fazer login com o Google
            </p>
          ) : (
            <>
              <p className="text-white mt-2 text-sm">
                Bem vindo {session?.user?.name}!
              </p>
              <p
                className=" text-sm text-white cursor-pointer hover:underline"
                onClick={() => signOut()}
              >
                Sair
              </p>
            </>
          )}

          <p className="mt-4 text-sm text-gray-300 leading-relaxed">
            Após criar seu bolão, você receberá um código único que poderá usar
            para convidar outras pessoas 🚀
          </p>

          <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
            <div className="flex items-center gap-6">
              <Image src={iconCheckImg} alt="" />
              <div className="flex flex-col">
                <span className="font-bold text-2xl">+{props.poolCount}</span>
                <span>Bolões criados</span>
              </div>
            </div>
            <div className="w-px h-14 bg-gray-600"></div>
            <div className="flex items-center gap-6">
              <Image src={iconCheckImg} alt="" />
              <div className="flex flex-col">
                <span className="font-bold text-2xl">+{props.guessCount}</span>
                <span>Palpites enviados</span>
              </div>
            </div>
          </div>
        </main>

        <Image
          src={appPreviewImage}
          alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa"
        />
      </div>
    </div>
  );
}

export const getStaticProps = async () => {
  const [poolCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api.get("pools/count"),
      api.get("guesses/count"),
      api.get("users/count"),
    ]);

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
  };
};
