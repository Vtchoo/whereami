import { IPage } from ".."

function MyPlaces() {

    return (
        <div>

        </div>
    )
}

const PageMyPlaces: IPage = {
    name: 'My Places',
    path: `/myplaces`,
    component: MyPlaces,
    exact: true,
}

export { PageMyPlaces }