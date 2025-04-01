import { useState } from 'react';
import GainSelect from './gainSelect';
import { useRouter } from 'next/router';
import GainsQuery from './gainsQuery';

const GainsTaxMain = () => {

    const router = useRouter();

    const [isOpen, setIsOpen] = useState(true);

    if (router.query.pk) {
        return (
            <GainsQuery property={router.query} />
        )
    }
    else {
        return (
            <GainSelect isOpen={isOpen} setIsOpen={setIsOpen} />
        )
    }
};

export default GainsTaxMain;
