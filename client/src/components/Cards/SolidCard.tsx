import React, { ReactNode } from 'react'

interface Props {
    bgStyle: string,
    titleStyle: string,
    icon?: ReactNode,
    title: string,
    dataStyle: string,
    data: string | number,

}

const SolidCard = ({ bgStyle, titleStyle, icon, title, data, dataStyle }: Props) => {
    return (
        <>
            <div className={"rounded-lg  py-4 pb-2 px-6" + " " + bgStyle}>
                <p className={"text-2xl font-semibold" + " " + titleStyle}>{title}</p>
                <div className={"text-7xl p-0 m-0 text-end font-semibold" + " " + dataStyle}>
                    <p>{data}</p>
                </div>


            </div>
        </>
    )
}

export default SolidCard