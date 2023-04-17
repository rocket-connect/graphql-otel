export function Container(props: React.PropsWithChildren<{}>) {
  return (
    <div className="container mx-auto w-5/6 md:w-2/3">{props.children}</div>
  );
}
