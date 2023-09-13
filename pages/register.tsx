import React from 'react'
import {
  Center,
  Flex,
  Text,
  Stack,
  Paper,
  Divider,
  Button as MantineButton,
  Anchor,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import SlackLogo from '../components/slack-logo'
import Input from '../components/input'
import Button from '../components/button'
import { BiLogoGoogle } from 'react-icons/bi'
import { FaApple } from 'react-icons/fa'
import { IoLogoGithub } from 'react-icons/io'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import axios from '../services/axios'
import { notifications } from '@mantine/notifications'
import { NextPage } from 'next'
import { GoogleLogin } from 'react-google-login'

const Register: NextPage = () => {
  const router = useRouter()
  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
    },
  })

  const mutation = useMutation({
    mutationFn: (body) => {
      return axios.post('/auth/register', body)
    },
    onError(error: any) {
      notifications.show({
        message: error?.response?.data?.data?.name,
        color: 'red',
        p: 'md',
      })
    },
    onSuccess() {
      localStorage.setItem('signUpEmail', form.values.email)
      router.push('/verify')
    },
  })

  const responseGoogle = () => {
    // Redirect to Google OAuth for authentication
    window.location.href = '/auth/google'
  }

  return (
    <Center p="xl" h="100vh" w="100vw" bg="#111317">
      <Stack justify="between">
        <Flex direction="column" align="center">
          <SlackLogo />
          <Text fz="3xl" fw={600} mt="3xl" c="white">
            First, enter your email
          </Text>
          <Text fz="sm" mt="xs">
            We suggest using the{' '}
            <Text span fw={600}>
              email address you use at work.
            </Text>
          </Text>

          {/* <GoogleLogin
            clientId="943288209734-n5p29rpfrr7tot29st0apmao3tesci1u.apps.googleusercontent.com"
            buttonText="Login with Google"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
          /> */}

          <Paper radius="md" p="xl" withBorder w={'40rem'} mt="xl">
            <form
              onSubmit={form.onSubmit(() =>
                mutation.mutate({ email: form.values.email } as any)
              )}
            >
              <Stack>
                <Input
                  required
                  label="Email"
                  placeholder="hello@adeolaadeoti.xyz"
                  value={form.values.email}
                  onChange={(event) =>
                    form.setFieldValue('email', event.currentTarget.value)
                  }
                  error={form.errors.email && 'Invalid email'}
                />
                <Button loading={mutation.isLoading} type="submit">
                  {mutation.isLoading ? '' : 'Continue'}
                </Button>
                <Divider label="or" labelPosition="center" my="md" />
                <MantineButton
                  leftIcon={<BiLogoGoogle size="1.8rem" />}
                  radius="md"
                  size="sm"
                  onClick={() => {
                    window.open(
                      `http://localhost:3000/api/v1/auth/google/callback`,
                      '_self'
                    )
                  }}
                  styles={(theme) => ({
                    root: {
                      backgroundColor: 'transparent',
                      border: '1px solid #373A40',
                      height: '4.5rem',
                      fontSize: '1.2rem',
                      '&:not([data-disabled])': theme.fn.hover({
                        backgroundColor: theme.fn.darken('#373A40', 0.05),
                        transition: 'background-color .3s ease',
                      }),
                    },

                    leftIcon: {
                      marginRight: theme.spacing.md,
                    },
                  })}
                >
                  Continue with Google
                </MantineButton>
                <Stack spacing="xs" mt="lg">
                  <Text size="xs" align="center">
                    Already using Slack?
                  </Text>
                  <Anchor size="xs" align="center" href="/signin">
                    Sign in to an existing workspace
                  </Anchor>
                </Stack>
              </Stack>
            </form>
          </Paper>
        </Flex>

        <Center p="xl">
          <MantineButton
            component="a"
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/adeolaadeoti"
            leftIcon={<IoLogoGithub size="1.4rem" />}
            styles={(theme) => ({
              root: {
                backgroundColor: 'transparent',
                fontSize: '1.2rem',
                fontWeight: 300,
                color: '#737780',
                '&:not([data-disabled])': theme.fn.hover({
                  color: theme.fn.darken('#373A40', 0.08),
                  backgroundColor: 'transparent',
                }),
              },
              leftIcon: {
                marginRight: theme.spacing.xs,
              },
            })}
          >
            adeolaadeoti
          </MantineButton>
        </Center>
      </Stack>
    </Center>
  )
}

export default Register
