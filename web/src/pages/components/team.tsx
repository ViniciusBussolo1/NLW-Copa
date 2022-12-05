import ReactCountryFlag from "react-country-flag";

interface Props {
  code: string;
  position: "left" | "right";
  countryCode: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

export default function Team(props: Props) {
  return (
    <>
      {props.position === "left" && (
        <ReactCountryFlag
          countryCode={props.countryCode}
          svg
          style={{
            width: "2rem",
            height: "2rem",
          }}
        />
      )}
      <input
        type="text"
        className="h-8 w-8 rounded px-2 py-2 bg-gray-900 border border-gray-600 text-sm text-gray-100 "
        onChange={props.onChange}
      />

      {props.position === "right" && (
        <ReactCountryFlag
          countryCode={props.countryCode}
          svg
          style={{
            width: "2rem",
            height: "2rem",
          }}
        />
      )}
    </>
  );
}
