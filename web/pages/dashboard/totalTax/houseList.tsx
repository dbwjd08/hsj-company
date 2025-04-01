const HouseList = (property: any) => {

    return (
        <div className="border-2 border-gray-300 rounded-2xl h-full mr-2">
            <div className="bg-gray-300 rounded-t-xl text-center p-2 font-semibold">내 부동산 목록</div>
            <div className="flex flex-col m-3 gap-3">
                {property.property.map((item: any, index: number) => {
                    return (
                        <div className={`border-2 border-l-[20px] p-3 flex flex-col ${index % 3 == 0 ? 'border-red-200' : index % 3 == 1 ? 'border-yellow-200' : 'border-blue-200'}`}>
                            <div>{item.property.complex.complex_name}</div>
                            <div className="text-sm">{item.property.dong} {item.property.ho}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
};

export default HouseList