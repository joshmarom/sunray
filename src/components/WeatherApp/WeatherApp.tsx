import * as React from 'react';
import * as A from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import {
  Title, Group, AppShell, Container, Grid, GridCol, SegmentedControl,
} from '@mantine/core';
import { useGeolocation } from 'react-use';
import { flow, pipe } from 'fp-ts/function';
import { useDisclosure } from '@mantine/hooks';
// @ts-ignore
import classes from './WeatherApp.module.css';
import { useHistory } from '@/api/hooks/useHistory';
import { useWeather } from '@/api/hooks/useWeather';
import { useForecast, useForecastData } from '@/api/hooks/useForecast';
import { Chart } from '@/components/LineChart/Chart';
import { useLocations } from '@/api/hooks/useLocations';
import { useGeoData } from '@/api/hooks/useGeoData';
import { useChartData, useForecastChartData } from '@/charts';
import { ConditionsQuadrant } from './ConditionsQuadrant';
import { AppHeader } from './AppHeader';
import { DaysScrollArea } from '@/components/WeatherApp/DaysScrollArea';
import { AppSidebar } from '@/components/WeatherApp/Sidebar';
import { CurrentWeather } from '@/types';
// import { useReverseGeoLocation } from '../../api/hooks/useReverseGeoLocation';

const getSidebarConfig = (isNavOpen: boolean) => ({
  width: { sm: 240, md: 300 },
  breakpoint: 'sm',
  collapsed: { mobile: !isNavOpen },
});

interface Props {
  location: string
}

export function WeatherApp({ location: locationProp }: Props) {
  const [isNavOpen, { toggle: toggleNav }] = useDisclosure(false);
  const [activeChartIndex, setActiveChartIndex] = React.useState<number>(0);
  const { latitude: lat, longitude: lon } = useGeolocation();
  const { data: geoData } = useGeoData({ lat, lon });
  const locationHookData = useLocations();
  // const geolocationData = useReverseGeoLocation({ lat: lat ?? 0, long: lon ?? 0 });

  const location = React.useMemo(() => {
    if (locationHookData.city || locationHookData.country) return locationHookData;

    return geoData?.features?.[0]?.properties;
  }, [geoData, locationHookData]);

  const locationAsString = React.useMemo(() => {
    const userDefined = [location?.city, location?.country]
      .map((s) => s?.trim())
      .filter(Boolean)
      .join(' ').trim();

    if (userDefined && userDefined.length > 2) return userDefined;

    return locationProp;
  }, [location, locationProp]);

  const history = pipe(
    locationAsString,
    useHistory,
    A.map(({ data }) => data),
    A.filterMap(O.fromNullable),
  );

  const current = pipe(
    locationAsString,
    useWeather,
    ({ data }) => data?.current,
  );

  const forecast = useForecast(locationAsString);
  const forecastChartData = useForecastChartData(forecast);
  const historyChartData = useForecastChartData(history);

  const dailyChartData = pipe(
    locationAsString,
    useForecastData,
    ({ data }) => data,
    O.fromNullable,
    O.map(({ forecast: { forecastday: day } }) => day[0].hour),
    O.getOrElse(A.zero<CurrentWeather>),
    useChartData,
  );

  const activeChart = [dailyChartData, forecastChartData, historyChartData][activeChartIndex];

  return (
    <AppShell header={{ height: 64 }} navbar={getSidebarConfig(isNavOpen)} py="sm" px="md">
      <AppHeader isNavOpen={isNavOpen} onNavToggle={toggleNav} />
      <AppSidebar {...locationHookData} />
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
              {current ? <ConditionsQuadrant current={current} /> : null}
            </GridCol>
          </Grid>
        </Container>

        <DaysScrollArea forecast={forecast} />
      </AppShell.Main>
    </AppShell>
  );
}
