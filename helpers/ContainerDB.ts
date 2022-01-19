import AsyncStorage from "@react-native-async-storage/async-storage";

import uniq from "./uniq";

export interface Container {
    _id: string;
    data: string[];
}

export default class ContainerDB {
    private static serializeId(id: string) {
        return `@CONTAINER:${id}`;
    }

    private static deserializeId(id: string) {
        return id.replace("@CONTAINER:", "");
    }

    private static containerFactory(
        id: string,
        data: string[] = []
    ): Container {
        return {
            _id: id,
            data: data,
        };
    }

    static async setActiveContainerId(id: string) {
        return await AsyncStorage.setItem("@CONTAINER_ACTIVE", id);
    }

    static async getActiveContainerId() {
        return await AsyncStorage.getItem("@CONTAINER_ACTIVE");
    }

    static async createContainer(id: string) {
        const container = this.containerFactory(id);

        await AsyncStorage.setItem(
            this.serializeId(id),
            JSON.stringify(container)
        );
    }

    static async deleteContainer(id: string) {
        await AsyncStorage.removeItem(this.serializeId(id));
    }

    static async addToContainer(id: string, items: string[]) {
        const currentData = await AsyncStorage.getItem(this.serializeId(id));

        if (currentData === null) {
            return null;
        }

        const container: Container = JSON.parse(currentData);

        container.data.push(...items);

        container.data = uniq(container.data);

        await AsyncStorage.setItem(
            this.serializeId(id),
            JSON.stringify(container)
        );

        return container;
    }

    static async getContainer(id: string): Promise<Container | null> {
        const data = await AsyncStorage.getItem(this.serializeId(id));

        if (data === null) {
            return null;
        }

        return JSON.parse(data);
    }

    static async containerExists(id: string) {
        return (await AsyncStorage.getItem(this.serializeId(id))) === null
            ? false
            : true;
    }

    static async getContainerIds() {
        const keys = await AsyncStorage.getAllKeys();

        return keys
            .filter((key) => key.startsWith("@CONTAINER:"))
            .map((key) => this.deserializeId(key));
    }
}
