
interface CardProps {
    children: React.ReactNode;
    title: string;
    subTitle?: string
}

const Card:React.FC<CardProps> = ({children,title, subTitle}) => {
  return (
    <div className="px-3 py-4 bg-white border-2 border-violet-300 w-full rounded-lg">
        <h4 className="font-bold text-2xl text-violet-950">{title}</h4>
        {subTitle && <p className="text-sm text-violet-950 mt-1">{subTitle}</p>}
        <div className="mt-3">{children}</div>
    </div>
  )
}

export default Card