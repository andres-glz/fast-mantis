import React from 'react'
import { Box, Container, HStack, Link, Stack, Text } from '@chakra-ui/react'
import { ExternalLink } from 'lucide-react'
export const Footer = () => {
  return (
    <Box
      as="footer"
      position="relative"
      overflow="hidden"
      mt={20}
      borderTop="1px solid"
      borderColor="border.emphasized"
      bg="bg.subtle"
      bgGradient="linear(135deg, rgba(59, 130, 246, 0.10) 0%, rgba(96, 165, 250, 0.05) 45%, rgba(255, 255, 255, 0.35) 100%)"
      _before={{
        content: '""',
        position: 'absolute',
        inset: 0,
        bgImage:
          'repeating-linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0 1px, transparent 1px 14px)',
        opacity: 0.9,
        pointerEvents: 'none',
      }}
      _after={{
        content: '""',
        position: 'absolute',
        inset: 0,
        bgGradient: 'radial(circle at top left, rgba(59, 130, 246, 0.18), transparent 55%)',
        pointerEvents: 'none',
      }}
    >
        <Container maxW="4xl" py={10} position="relative" zIndex={1}>
            <Stack
              direction={{ base: 'column', md: 'row' }}
              justifyContent="space-between"
              alignItems={{ base: 'flex-start', md: 'center' }}
              gap={3}
            >
                <Link href="#"   fontSize="md" fontWeight="semibold" color="fg" letterSpacing="0.08em" textTransform="uppercase" _hover={{ color: 'blue.solid', transform: 'scale(1.05)', textDecoration: 'none' }} transition="all 0.2s ease">
                  Fast Mantis
                </Link>
                <HStack gap={3} color="fg.subtle" fontSize="md">
                  <Text _hover={{ transform: 'scale(1.05)' }} transition="transform 0.2s ease">
                    Powered by <Text as="span" fontWeight="semibold" color="fg.muted" >jagonzalez</Text>
                  </Text>
                  <Text>
                    |
                  </Text>
                  <Link
                    href="https://github.com/andres-glz/fast-mantis"
                    isExternal
                    display="inline-flex"
                    alignItems="center"
                    gap={1}
                    fontWeight="medium"
                    color="blue.solid"
                    target="_blank"
                    _hover={{ color: 'blue.fg', textDecoration: 'none', transform: 'scale(1.05)' }}
                    transition="all 0.2s ease"
                  >
                    GitHub
                    <ExternalLink size={14} />
                  </Link>
                </HStack>
            </Stack>
        </Container>
    </Box>
  )
}
