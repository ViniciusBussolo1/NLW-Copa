import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

import { getName } from "country-list";

import dayjs from "dayjs";
import ptBR from "dayjs/locale/pt-br";

import Image from "next/image";

import { api } from "../lib/axios";
import { useEffect, useState } from "react";
import { Check } from "phosphor-react";

import { PoolsProps } from "../pages/boloes";

import Team from "./components/team";
import Header from "./components/header";
import toast from "react-hot-toast";

interface DetailsProps {
  name: string;
  email: string;
  image: string;
}

interface GuessProps {
  id: string;
  gameId: string;
  createdAt: string;
  participantId: string;
  firstTeamPoints: number;
  secondTeamPoints: number;
}

interface GameProps {
  id: string;
  date: Date;
  firstTeamCountryCode: string;
  secondTeamCountryCode: string;
  guess: null | GuessProps;
}

export default function Details(props: DetailsProps) {
  const [poolDetails, setPoolDetails] = useState<PoolsProps>({} as PoolsProps);
  const [games, setGames] = useState<GameProps[]>([]);
  const [firstTeamPoints, setFirstTeamPoints] = useState("");
  const [secondTeamPoints, setSecondTeamPoints] = useState("");
  const router = useRouter();

  const { poolId } = router.query;

  async function fetchPoolsDetails() {
    try {
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${router.query.routerToken}`;
      const response = await api.get(`/pools/${poolId}`);
      setPoolDetails(response.data.pool);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async function fetchGames() {
    try {
      const response = await api.get(`/pools/${poolId}/games`);
      setGames(response.data.games);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async function handleGuessConfirm(gameId: string) {
    try {
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return alert("Informe o placar para palpitar");
      }

      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      });

      toast.success("Palpite realizado com sucesso!");
    } catch (error) {
      console.log(error);
      toast.error("Não foi possível enviar o palpite!");
      throw error;
    }

    fetchGames();
  }

  useEffect(() => {
    fetchPoolsDetails();
    fetchGames();
  }, [poolId]);

  return (
    <>
      <Header name={props.name} image={props.image} />

      <div className="max-w-[1124px] mx-auto my-6 flex flex-col gap-y-3">
        <div className="flex justify-between items-center border-b border-gray-600 py-6">
          <div className="flex flex-col gap-y-1">
            <h1 className="text-white text-3xl">{poolDetails.title}</h1>
            <span className="text-gray-500">Código: {poolDetails.code}</span>
          </div>

          <div className="flex">
            {poolDetails.participants &&
              poolDetails.participants.map((partcipant) => {
                return (
                  <Image
                    key={partcipant.id}
                    src={partcipant.user.avatarUrl}
                    alt="Imagem de avatar do Google"
                    width={30}
                    height={30}
                    quality={100}
                    className="rounded-3xl"
                  />
                );
              })}
            <div className="h-8 w-8 bg-gray-600 rounded-3xl flex items-center justify-center text-white text-sm">
              {poolDetails._count?.participants
                ? `+${poolDetails._count.participants}`
                : 0}
            </div>
          </div>
        </div>

        {games.map((game) => {
          const date = dayjs(game.date)
            .locale(ptBR)
            .format("DD [de] MMMM [de] YYYY [às] HH:00[h]");

          const data = new Date();
          const today = data.toISOString();

          const dataGame = new Date(game.date);
          const gameData = dataGame.toISOString();

          return (
            <>
              <div
                key={game.id}
                className="bg-gray-800 rounded px-4 py-6 flex flex-col items-center justify-center border-b-2 border-yellow-500 cursor-pointer"
              >
                <div className="flex flex-col items-center">
                  <h3 className="font-bold leading-tight text-white text-xl">
                    {getName(game.firstTeamCountryCode)} vs{" "}
                    {getName(game.secondTeamCountryCode)}
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {date}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4 w-64">
                  <div className="flex items-center gap-2">
                    <Team
                      code={game.id}
                      position="right"
                      onChange={(
                        e: React.ChangeEvent<HTMLInputElement>
                      ): void => setFirstTeamPoints(e.target.value)}
                      value={firstTeamPoints}
                      countryCode={game.firstTeamCountryCode}
                    />
                  </div>

                  <span className="color-gray-900">X</span>

                  <div className="flex items-center gap-2">
                    <Team
                      code={game.id}
                      position="left"
                      onChange={(
                        e: React.ChangeEvent<HTMLInputElement>
                      ): void => setSecondTeamPoints(e.target.value)}
                      value={secondTeamPoints}
                      countryCode={game.secondTeamCountryCode}
                    />
                  </div>
                </div>

                {gameData <= today ? (
                  <button
                    className="text-gray-500 w-64 bg-gray-600 rounded flex items-center justify-center text-sm py-2 mt-4"
                    disabled={true}
                  >
                    TEMPO ESGOTADO
                  </button>
                ) : (
                  !game.guess && (
                    <button
                      className="text-white w-64 bg-ignite-500 hover:bg-ignite-600 rounded flex items-center justify-center gap-2 text-sm py-2 mt-4"
                      onClick={() => handleGuessConfirm(game.id)}
                    >
                      CONFIRMAR PALPITE{" "}
                      <Check color="white" width={20} height={20} />
                    </button>
                  )
                )}
              </div>
            </>
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
