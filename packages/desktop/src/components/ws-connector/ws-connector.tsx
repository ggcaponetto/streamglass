import { Flex, Spinner, Switch } from '@radix-ui/themes'

export default function Connector() {
    return (
        <div>
            Connector
            <Flex gap="4">
                <Spinner loading={true}>
                    <Switch defaultChecked />
                </Spinner>

                <Spinner loading={false}>
                    <Switch defaultChecked />
                </Spinner>
            </Flex>
        </div>
    )
}
