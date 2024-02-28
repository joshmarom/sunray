import * as React from 'react';
import * as A from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import {
    Title,
    ScrollArea,
    Group,
    Select,
    Stack,
    AppShell,
    Burger,
    Container,
    Grid,
    GridCol,
    SegmentedControl,
} from '@mantine/core';
import { useGeolocation } from 'react-use';
import '@mantine/carousel/styles.css';
import { flow, pipe } from 'fp-ts/function';
import { useDisclosure } from '@mantine/hooks';
import classes from './WeatherApp.module.css';
import { useHistory } from '../../api/hooks/useHistory';
import { useWeather } from '../../api/hooks/useWeather';
import { useForecast, useForecastData } from '../../api/hooks/useForecast';
import { DayCard } from '../DayCard/DayCard';
import { Chart } from '../LineChart/Chart';
import { useLocations } from '../../api/hooks/useLocations';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
import { useGeoData } from '../../api/hooks/useGeoData';
import { Logo } from '../Logo';
import { useChartData, useForecastChartData } from '../../charts';
import { ConditionsQuadrant } from './ConditionsQuadrant';
// import { useReverseGeoLocation } from '../../api/hooks/useReverseGeoLocation';

const DEFAULT_LOCATION = 'Tel Aviv';

interface Props {
    location?: string
}

const isToday = (date: string) => date === new Date().toISOString().split('T')[0];

export function WeatherApp({ location: locationProp = DEFAULT_LOCATION }: Props) {
    const [isNavOpen, { toggle: toggleNav }] = useDisclosure(false);
    const { latitude: lat, longitude: lon } = useGeolocation();
    const { data: geoData } = useGeoData({ lat, lon });
    // const geolocationData = useReverseGeoLocation({ lat: lat ?? 0, long: lon ?? 0 });

    const {
        isSuccess: locationsLoaded,
        city,
        country,
        countries,
        cities,
        handleSelectCountry,
        handleSelectCity,
    } = useLocations();

    const location = React.useMemo(
        () =>
            (city || country)
                ? ({ city, country })
                : geoData?.features?.[0]?.properties,
        [geoData, country, city]
    );

    const locationAsString = React.useMemo(() => {
        const userDefined = [location?.city, location?.country]
            .map(s => s?.trim())
            .filter(Boolean)
            .join(' ').trim();

        if (userDefined && userDefined.length > 2) return userDefined;

        return locationProp;
    }, [location]);

    const current = useWeather(locationAsString);
    const todayForecast = useForecastData(locationAsString);
    const todayTempData = todayForecast.data?.forecast.forecastday[0].hour ?? [];
    const forecast = useForecast(locationAsString);

    const history = pipe(
        locationAsString,
        useHistory,
        A.map(({ data }) => data),
        A.filterMap(O.fromNullable)
    );

    const [activeChartIndex, setActiveChartIndex] = React.useState<number>(0);
    const dailyChartData = useChartData(todayTempData);
    const forecastChartData = useForecastChartData(forecast);
    const historyChartData = useForecastChartData(history);
    const activeChart = [dailyChartData, forecastChartData, historyChartData][activeChartIndex];

    const currentData = React.useMemo(() => pipe(
        O.fromNullable(current.data?.current),
        O.toUndefined
    ), [current.data]);

    return (
        <AppShell
          header={{ height: 64 }}
          navbar={{
              width: { sm: 240, md: 300 },
              breakpoint: 'sm',
              collapsed: { mobile: !isNavOpen },
            }}
          padding="md"
        >
            <AppShell.Header className={classes.header}>
                <Group justify="space-between" p="md">
                    <Burger opened={isNavOpen} onClick={toggleNav} hiddenFrom="sm" size="sm" />
                    <Logo />
                    <ColorSchemeToggle />
                </Group>
            </AppShell.Header>

            <AppShell.Navbar
              p={
                { sm: 'sm', md: 'lg' }
            }
              className={classes.sidebar}
            >
                <Stack gap="md">
                <Title size="h5" c="natural">Pick a Location</Title>
                    <Select
                      data={countries}
                      searchable
                      placeholder="Select Country"
                      value={country}
                      onChange={handleSelectCountry}
                      disabled={!locationsLoaded}
                    />
                    <Select
                      data={cities}
                      searchable
                      placeholder="Select City"
                      value={city}
                      onChange={handleSelectCity}
                      disabled={!country}
                    />
                </Stack>
            </AppShell.Navbar>

            <AppShell.Main className={classes.main}>
                <Container size="xl">
                    <Group align="baseline" gap="md" my="lg">
                        <Title className={classes.title}>
                            {location?.city ?? locationAsString}
                        </Title>
                        <Title className={classes.title} fw="200">
                            {location?.country}
                        </Title>
                    </Group>

                    <Grid gutter="xl">
                        <GridCol span={{ sm: 12, md: 8 }}>
                            <SegmentedControl
                              mb="md"
                              value={String(activeChartIndex)}
                              onChange={flow(Number, setActiveChartIndex)}
                              data={[
                                  { label: 'Daily', value: '0' },
                                  { label: 'Forecast', value: '1' },
                                  { label: 'History', value: '2' },
                              ]}
                            />
                            <Chart data={activeChart} width={800} height={400} />
                        </GridCol>
                        <GridCol span={{ sm: 12, md: 4 }}>
                            {currentData ? <ConditionsQuadrant current={currentData} /> : null}
                        </GridCol>
                    </Grid>
                </Container>

                <ScrollArea className={classes.scrollArea} py="60" offsetScrollbars scrollbarSize="xs">
                    <Group gap="sm" wrap="nowrap">
                        {pipe(
                            forecast,
                            A.filterMap(O.fromNullable),
                            A.map((day) =>
                                <DayCard
                                  className={classes.card}
                                  key={day.date}
                                  forecast={day}
                                  withBorder={isToday(day.date)}
                                />
                            )
                        )}
                    </Group>
                </ScrollArea>
            </AppShell.Main>
        </AppShell>
    );
}
