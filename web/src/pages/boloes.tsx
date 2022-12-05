import { getSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import { api } from "../lib/axios";
import { useRouter } from "next/router";

import Link from "next/link";

import CardBoloes from "./components/cardBoloes";
import Header from "./components/header";
import toast from "react-hot-toast";

interface BoloesProps {
  name: string;
  email: string;
  image: string;
}

export interface ParticipantProps {
  id: string;
  user: {
    name: string;
    avatarUrl: string;
  };
}

export interface PoolsProps {
  id: string;
  code: string;
  title: string;
  ownerId: string;
  createdAt: string;
  owner: {
    name: string;
  };
  participants: ParticipantProps[];
  _count: {
    participants: number;
  };
}

export default function Boloes(props: BoloesProps) {
  const [pools, setPools] = useState<PoolsProps[]>([]);
  const [code, setCode] = useState("");
  const router = useRouter();

  async function fetchPools() {
    try {
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${router.query.routerToken}`;
      const response = await api.get("/pools");
      setPools(response.data.pools);
    } catch (error) {
      throw error;
    }
  }

  async function fetchPoolId(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post("/pools/join", {
        code: code,
      });

      toast.success(`Bolão encontrado com sucesso!`);

      console.log(response);
    } catch (error) {
      toast.error(`Não foi possível encontrar o bolão!`);
      console.log(error);
      throw error;
    }
  }

  useEffect(() => {
    fetchPools();
  }, []);

  return (
    <>
      <Header name={props.name} image={props.image} />

      <div className="max-w-[1124px] mx-auto my-6 flex flex-col gap-y-3">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold leading-tight text-white ">
            Meus Bolões
          </h1>
          <form onSubmit={fetchPoolId} className="flex gap-2">
            <input
              className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
              type="text"
              required
              placeholder="Qual o código do bolão?"
              onChange={(event) => setCode(event.target.value)}
              value={code}
            />
            <button
              className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
              type="submit"
            >
              Buscar Bolão
            </button>
          </form>
        </div>
        {pools.map((pool) => {
          return (
            <Link
              key={pool.id}
              href={{
                pathname: "/details",
                query: {
                  poolId: pool.id,
                  routerToken: router.query.routerToken,
                },
              }}
            >
              <CardBoloes
                title={pool.title}
                _countParticipants={pool._count.participants}
                owner={pool.owner.name}
                participants={pool.participants}
              />
            </Link>
          );
        })}
      </div>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  const session = await getSession(context);

  return {
    props: {
      name: session?.user?.name,
      email: session?.user?.email,
      image: session?.user?.image,
    },
  };
};
