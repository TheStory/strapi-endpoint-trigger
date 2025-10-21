import { useFetchClient } from '@strapi/strapi/admin';
import { Button, Divider } from '@strapi/design-system';
import { useState } from 'react';
import styled from 'styled-components';

const Container = styled('div')`
  padding-top: 2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 2rem;
`;

const ClearCacheButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const client = useFetchClient();

  async function trigger() {
    setIsLoading(true);
    await client.post('/strapi-endpoint-trigger/trigger');
    setIsLoading(false);
  }

  return (
    <Container>
      <Divider />
      <Button variant={'danger-light'} onClick={trigger} disabled={isLoading}>
        Clear website cache
      </Button>
    </Container>
  );
};

export default ClearCacheButton;
