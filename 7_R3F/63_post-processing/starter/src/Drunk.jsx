import DrunkEffect from "./DrunkEffect.jsx";

export default function Drunk(props) {
  const effect = new DrunkEffect(props);

  return <primitive ref={props.ref} object={effect} />;
}
