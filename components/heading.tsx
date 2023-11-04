import React from 'react';

interface HeadingProps {
    title: string;
    subTitle?: string;
}

const Heading: React.FC<HeadingProps> = ({ title, subTitle }) => {
    return (
        <div className="flex flex-col gap-y-2">
            <h3 className="text-violet-950 font-bold text-3xl">{title}</h3>
            <p className="text-violet-500 text-sm">{subTitle}</p>
        </div>
    );
};

export default Heading;
