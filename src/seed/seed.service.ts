import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './intefaces/poke-response.interface';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  private readonly axios: AxiosInstance = axios;

  async executeSeed() {
    await this.pokemonModel.deleteMany({});
    try {
      const { data } = await this.axios.get<PokeResponse>(
        'https://pokeapi.co/api/v2/pokemon?limit=650',
      );

      const pokemonToInsert: { name: string; number: number }[] = [];

      data.results.forEach(({ name, url }) => {
        const segments = url.split('/');
        const number = +segments[segments.length - 2];
        // const pokemon = await this.pokemonModel.create({ name, number });
        pokemonToInsert.push({ name, number });
      });
      await this.pokemonModel.insertMany(pokemonToInsert);
      return 'Seed executed';
    } catch (error) {
      console.log(error);
    }
  }
}
