import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

import SvgEasy from '@site/static/img/easy.svg';
import SvgFocus from '@site/static/img/focus.svg';

interface FeatureItem {
    title: string;
    Svg: React.ComponentType<React.ComponentProps<'svg'>>;
    description: ReactNode;
}

const FeatureList: FeatureItem[] = [
    {
        title: 'Easy to Use',
        Svg: SvgEasy,
        description: (
            <>
                StreamGlass was designed from the ground up to be easily
                installed and used to get your website up and running quickly.
            </>
        ),
    },
    {
        title: 'Focus on What Matters',
        Svg: SvgFocus,
        description: (
            <>
                StreamGlass lets you focus on your workflow, and we&apos;ll do
                the chores. Go ahead and define how you stream, your way.
            </>
        ),
    },
];

function Feature({ title, Svg, description }: FeatureItem) {
    return (
        <div className={clsx('col col--4')}>
            <div className="text--center">
                <Svg className={styles.featureSvg} role="img" />
            </div>
            <div className="text--center padding-horiz--md">
                <Heading as="h3">{title}</Heading>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default function HomepageFeatures(): ReactNode {
    return (
        <section className={styles.features}>
            <div
                className="container"
                style={{
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div
                    className="row"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {FeatureList.map((props, idx) => (
                        <Feature key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}
