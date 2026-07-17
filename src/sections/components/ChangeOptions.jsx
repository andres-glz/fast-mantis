import { Switch, VStack, Text } from '@chakra-ui/react'
import React from 'react'

export const ChangeOptions = ({ change, onChange }) => {
    const handleCheckedChange = (key) => (e) => {
        onChange({ ...change, [key]: e.checked })
    }

    return (
        <VStack border="1px solid" borderColor="gray.800" borderRadius="md" p={2} w="15%" alignItems="flex-start" spacing={2} ml={6}>
            <Text fontSize={'sm'} color="gray.400" fontWeight={'semibold'}>Mostrar en:</Text>
            <Switch.Root size="xs" colorScheme="blue" checked={change.showInPM} onCheckedChange={handleCheckedChange('showInPM')}>
                <Switch.HiddenInput />
                <Switch.Control />
                <Switch.Label fontSize={'small'}>PM</Switch.Label>
            </Switch.Root>
            <Switch.Root size="xs" colorScheme="blue" checked={change.showInPDF} onCheckedChange={handleCheckedChange('showInPDF')}>
                <Switch.HiddenInput />
                <Switch.Control />
                <Switch.Label fontSize={'small'}>PDF</Switch.Label>
            </Switch.Root>
            <Switch.Root size="xs" colorScheme="blue" checked={change.showInCommit} onCheckedChange={handleCheckedChange('showInCommit')}>
                <Switch.HiddenInput />
                <Switch.Control />
                <Switch.Label fontSize={'small'}>Commit</Switch.Label>
            </Switch.Root>
        </VStack>
    )
}
