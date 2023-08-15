import {
  createStyles,
  Navbar,
  Text,
  Group,
  Grid,
  Avatar,
  Tooltip,
  ActionIcon,
  Switch,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core'
import { getColorByIndex } from '../../utils/helpers'
import { TbHeadphonesOff, TbHeadphones } from 'react-icons/tb'
import { HiPlus } from 'react-icons/hi'
import React from 'react'
import AccountSwitcher from '../account-switcher'
import MessageLayout from './message-layout'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import axios from '../../services/axios'

const useStyles = createStyles((theme) => ({
  section: {
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.md,

    '&:not(:first-of-type)': {
      borderTop: `1px solid ${theme.colors.dark[4]}`,
    },
  },
  footer: {
    marginTop: 'auto',
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: '1rem',

    paddingTop: theme.spacing.md,
    borderTop: `1px solid ${theme.colors.dark[4]}`,
  },

  collectionLink: {
    display: 'flex',
    gap: theme.spacing.sm,
    alignItems: 'center',
    padding: `.7rem ${theme.spacing.xs}`,
    textDecoration: 'none',
    borderRadius: theme.radius.sm,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.dark[0],
    lineHeight: 1,
    fontWeight: 500,
    textTransform: 'lowercase',

    '&:hover': {
      backgroundColor: theme.colors.dark[6],
      color: theme.white,
    },
  },
}))

export default function DefaultLayout({ children, data, channelData }: any) {
  const router = useRouter()
  const { id } = router.query

  const { classes } = useStyles()
  const [selected, setSelected] = React.useState(channelData)

  const query = useQuery(
    ['channel-layout'],
    () => axios.get(`/channel/${id}`),
    {
      enabled: !!id,
      onSuccess(data) {
        setSelected(data?.data?.data)
      },
    }
  )

  function handleChannel(channel: any) {
    router.push(`/client/${channel?._id}`)
    setSelected(channel)
  }
  function handleCoworker(data: any) {
    setSelected(data)
  }

  return (
    <Grid h="100vh" m="0">
      <Grid.Col span={2} p="0">
        <Navbar>
          <Navbar.Section mt="sm" p="sm" pt="xs" pb="1.18rem">
            <AccountSwitcher data={data} />
          </Navbar.Section>

          <Navbar.Section className={classes.section}>
            <Group align="center" position="apart">
              <Text size="xs" mb="sm" color="dimmed">
                Channels
              </Text>
              <Tooltip label="Add channels" withArrow position="right">
                <ActionIcon variant="default" size={30}>
                  <HiPlus size="1.2rem" />
                </ActionIcon>
              </Tooltip>
            </Group>

            {data?.channels?.map((channel: any) => (
              <UnstyledButton
                w="100%"
                onClick={() => handleChannel(channel)}
                key={channel._id}
                className={classes.collectionLink}
                style={{
                  transition: 'all .2s ease',
                  fontWeight: selected?._id === channel._id ? 'bold' : '400',
                  color: selected?._id === channel._id ? 'white' : '#C1C2C5',
                }}
              >
                # {channel?.name}
              </UnstyledButton>
            ))}
          </Navbar.Section>

          <Navbar.Section className={classes.section}>
            <Group align="center" position="apart">
              <Text size="xs" weight="bold" mb="sm" color="dimmed">
                Direct messages
              </Text>
              <Tooltip label="Add teammates" withArrow position="right">
                <ActionIcon variant="default" size={30}>
                  <HiPlus size="1.2rem" />
                </ActionIcon>
              </Tooltip>
            </Group>
            {data?.coWorkers?.map((coWorker: any, index: any) => (
              <UnstyledButton
                w="100%"
                onClick={() => handleCoworker(coWorker)}
                key={coWorker._id}
                className={classes.collectionLink}
                style={{
                  transition: 'all .2s ease',
                  fontWeight: selected?._id === coWorker._id ? 'bold' : '400',
                  color: selected?._id === coWorker._id ? 'white' : '#C1C2C5',
                }}
              >
                <Avatar size="md" color={getColorByIndex(index)} radius="xl">
                  {coWorker?.username[0].toUpperCase()}
                </Avatar>
                {coWorker.username}{' '}
                <Text fw="100" c={useMantineTheme().colors.dark[3]} span>
                  {coWorker.isLoggedIn ? 'you' : ''}{' '}
                </Text>
              </UnstyledButton>
            ))}
          </Navbar.Section>

          <Navbar.Section className={classes.footer}>
            <Text tt="lowercase" size="sm">
              {selected?.name ?? selected?.username}
            </Text>

            <Switch
              size="xl"
              color={useMantineTheme().colorScheme === 'dark' ? 'gray' : 'dark'}
              onLabel={
                <TbHeadphonesOff
                  size="1.5rem"
                  color={useMantineTheme().colors.red[4]}
                />
              }
              offLabel={
                <TbHeadphones
                  size="1.5rem"
                  color={useMantineTheme().colors.blue[6]}
                />
              }
            />
          </Navbar.Section>
        </Navbar>
      </Grid.Col>

      <Grid.Col span="auto" p="0">
        {children}
      </Grid.Col>
    </Grid>
  )
}
