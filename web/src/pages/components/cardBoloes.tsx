import { ParticipantProps } from "../boloes";
import Image from "next/image";

interface cardBoloesProps {
  title: string;
  owner: string;
  participants: ParticipantProps[];
  _countParticipants: number;
}

export default function CardBoloes(props: cardBoloesProps) {
  return (
    <div className="bg-gray-800 rounded px-4 py-6 flex items-center justify-between border-b-2 border-yellow-500 cursor-pointer hover:bg-gray-900">
      <div>
        <h2 className="font-bold leading-tight text-white text-xl">
          {props.title}
        </h2>
        <p className="text-sm text-gray-300 leading-relaxed">
          Criado por {props.owner}
        </p>
      </div>

      <div className="flex">
        {props.participants &&
          props.participants.map((partcipant) => {
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
          {props._countParticipants ? `+${props._countParticipants}` : 0}
        </div>
      </div>
    </div>
  );
}
